import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode , toNano} from 'ton-core';
import * as fs from 'fs';

const fileContent1: string = fs.readFileSync('descriptions/example/c1.bc', 'utf8');
const fileContent2: string = fs.readFileSync('descriptions/example/c2.bc', 'utf8');
const fileContent3: string = fs.readFileSync('descriptions/example/c3.bc', 'utf8');

const c1: Cell = Cell.fromBase64(fileContent1);
const c2: Cell = Cell.fromBase64(fileContent2);
const c3: Cell = Cell.fromBase64(fileContent3);

export type Task3Config = {};

export function task3ConfigToCell(config: Task3Config): Cell {
    return beginCell()
    .storeRef(beginCell().storeUint(77, 32).endCell())
    .endCell();
}

export class Task3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task3(address);
    }

    static createFromConfig(config: Task3Config, code: Cell, workchain = 0) {
        const data = task3ConfigToCell(config);
        const init = { code, data };
        return new Task3(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getVersion(provider: ContractProvider) {
        const {stack} = await provider.get('version', []);
        return stack.readNumberOpt();
    }
    async getUSDAmount(provider: ContractProvider) {
        const {stack} = await provider.get('get_USD_amount', []);
        return stack.readNumberOpt();
    }
    async getAmount(provider: ContractProvider) {
        const {stack} = await provider.get('get_amount', []);
        return stack.readNumberOpt();
    }

    async getStorage(provider: ContractProvider) {
        const {stack} = await provider.get('teststorage', []);
        return stack.readCellOpt()?.asSlice().loadUint(32);
    }

    async sendFirst(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.1),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(0, 32)
            .storeMaybeRef(c1)
            .storeDict(Dictionary.empty())
            .storeMaybeRef(beginCell().endCell())
            .endCell(),
        });
    }

    async sendV1(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.1),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(1, 32)
            .storeMaybeRef(c1)
            .storeDict(Dictionary.empty())
            .storeRef(beginCell().endCell())
            .endCell(),
        });
    }

    async sendV2(provider: ContractProvider, via: Sender) {
        const dic = Dictionary.empty({
            bits: 32, parse: (src) => src, serialize: (src) => src
        },{
            serialize: (src: any, builder) => builder.storeSlice(src.beginParse()), 
            parse: (slice) => ({
                new_version: slice.loadUint(32),
                mig: slice.loadMaybeRef(),
            }),
        })
        .set(1n, beginCell().storeUint(2, 32).storeMaybeRef().endCell())
        // .set(2n, beginCell().storeUint(2, 32).storeMaybeRef(beginCell().storeUint(2, 32).storeMaybeRef(c3).endCell()).endCell())
        // console.log('dic', dic.get(2n).asSlice().loadDictDirect({
        //     bits: 32, parse: (src: bigint) => src, serialize: (src: bigint) => src
        // }, {
        //     serialize: (src: any, builder: any) => builder.storeUint(src as number, 32), 
        //     parse: (slice: any) => slice.loadUint(32),
        // }));
        await provider.internal(via, {
            value: toNano(0.1),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(2, 32)
            .storeMaybeRef(c2)
            .storeDict(dic)
            .storeRef(beginCell().storeUint(7, 32).endCell())
            .endCell(),
        });
    }
    async sendV3(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.1),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(3, 32)
            .storeMaybeRef(c3)
            .storeDict(Dictionary.empty({
                bits: 32, parse: (src) => src, serialize: (src) => src
            },{
                serialize: (src: any, builder) => builder.storeSlice(src.beginParse()), 
                parse: (slice) => ({
                    new_version: slice.loadUint(32),
                    mig: slice.loadMaybeRef(),
                }),
            })
                .set(1n, beginCell().storeUint(2, 32).storeMaybeRef().endCell())
                .set(2n, beginCell().storeUint(3, 32).storeMaybeRef(c3).endCell())
                // .set(3n, beginCell().storeUint(3n, 32).storeMaybeRef(beginCell().endCell()).endCell())
            )
            .storeRef(beginCell().storeUint(100, 40).endCell())
            .endCell(),
        });
    }
}
