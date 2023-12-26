import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Tuple, TupleReader, TupleItemInt  } from 'ton-core';

export type Task4Config = {};

export function task4ConfigToCell(config: Task4Config): Cell {
    return beginCell().endCell();
}


const parseStringToTuple = (line: string) => line.split('').map((c: string) => ({type: 'int', value: BigInt(c.charCodeAt(0))}) as TupleItemInt);
const parseStringArray = (maze: string[]) => {
    return maze.map((line) => {
        return { type: 'tuple', items: parseStringToTuple(line) } as Tuple
    })
}

function parseTupleArrayAuto(tr: TupleReader | null, withString: boolean = true) {
    if(!tr) {
        return null;
    }
    return new Array(Number(tr.remaining)).fill(0).map((_: any, index: number) => {
        const lineReader = tr.readTuple();
        if(withString) {
            return new Array(Number(lineReader.remaining)).fill(0).map((_: any, i2: number) => {
                return String.fromCharCode(lineReader.readNumber());
            }).join('');
        }
        return new Array(Number(lineReader.remaining)).fill(0).map((_: any, i2: number) => {
            return lineReader.readNumber();
        });
        
    })
}

export class Task4 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task4(address);
    }

    static createFromConfig(config: Task4Config, code: Cell, workchain = 0) {
        const data = task4ConfigToCell(config);
        const init = { code, data };
        return new Task4(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendSolve(provider: ContractProvider, n: bigint, m: bigint, maze: string[]) {
        const nn: bigint = BigInt(maze.length);
        const mm: bigint = BigInt(maze[0].length);
        const {stack} = await provider.get('solve', [
            {type: 'int', value: nn},
            {type: 'int', value: mm},
            {type: 'tuple', items: parseStringArray(maze)},
        ]);

        // const resItems =  await stack.readTuple();
        // console.log('stack', stack);
        return [stack.readNumberOpt(), stack.readNumberOpt(), stack.readNumberOpt(),  parseTupleArrayAuto(stack.readTupleOpt())];
        // const arranged = resItems.map((t: TupleItem, i: number) => {
        //     if(t.type === 'int') {
        //         return parseTupleItemInt(t);
        //     }
        //     if(t.type === 'null') {
        //         return t;
        //     }
        //     if(t.type === 'tuple') {
        //         return t.items.map((t: TupleItem) => {
        //             if(t.type === 'int') {
        //                 return parseTupleItemInt(t);
        //             }
        //             return t;
        //         })
        //     }
        // })
        // return arranged;
    }
}
