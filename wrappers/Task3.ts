import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode , toNano} from 'ton-core';

const c1: Cell = Cell.fromBase64('te6ccgEBCgEAqAABFP8A9KQT9LzyyAsBAgFiAgMCAs4EBQARoFTv2omhrhY/AgEgBgcCASAICQCtCDXScEgkl8E4NMf9AT0BDHUMCLAAI4iMiBus5gg0O0e7VP7BJEw4u1E0NQwAdAUQzDwAXEB8ALtVOAx7UTQ0x8wUSK58tGQ8AMB0BQQNUFQ8AHwAu1UgABcXwTQ1wsfpMjLH8mAADQByMsfzMmAAEztRNCAINch1DCA=');
const c2: Cell = Cell.fromBase64('te6ccgECDwEAATAAART/APSkE/S88sgLAQIBYgIDAgLOBAUCASALDAIBIAYHAgEgCQoByQg10nBIJJfBODTH/QE9ATUJMAAjiQwMTIgbrOYINDtHu1T+wSRMOLtRNDUMAHQFEMw8AFxAfAC7VTgM+1E0NMfMFNAufLwU0C84wJsIlEiup/wAwHQFBA1QVDwAfAC7VSSXwXigCAAhGwxAdDXCx8B0x8woMjLH8mAAogP0BDAgbvLQyCDQ7R7tU/sEWYAg9A5voTDTH/QEMCBus5gg0O0e7VP7BJEw4lIDup/wAwHQFBA1QVDwAfAC7VTgMfADAdAUQzDwAXMB8ALtVAANAHIyx/MyYAATO1E0IAg1yHUMIAARvVO/aiaGuFj8AgEgDQ4AEbjffwA9DXCx+AATu0D4IBjfftQ9iA==');
const c3: Cell = Cell.fromBase64('te6ccgEBDgEAjwABFP8A9KQT9LzyyAsBAgFiAgMCAs4EBQIBIAoLAgEgBgcCASAICQA9IAg1yH0BDH0BDHUMO1E0NQwAdAUQzDwAX4B8ALtVIAAhGwxAdDXCycB0ycwoMjLJ8mAACQxyMzJgAAs7UTQ1DCAAB71Tu/QCASAMDQARuN9/AD0NcLJ4ABu7QPggGN9+1D2IBkqQSA==');

export type Task3Config = {};

export function task3ConfigToCell(config: Task3Config): Cell {
    return beginCell()
    .storeRef(beginCell().storeUint(9, 32).endCell())
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
            .storeMaybeRef(beginCell().endCell())
            .endCell(),
        });
    }

    async sendV2(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.1),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(2, 32)
            .storeMaybeRef(c2)
            .storeDict(Dictionary.empty({
                bits: 32, parse: (src) => src, serialize: (src) => src
            },{
                serialize: (src: any, builder) => builder.storeMaybeRef(src), 
                parse: (slice) => slice.loadMaybeRef(),
            }).set(2n, beginCell().endCell()).set(1n, beginCell().storeUint(2, 32).storeMaybeRef(c2).endCell()))
            .storeMaybeRef(beginCell().endCell())
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
            .storeDict(Dictionary.empty()
                .set(1n, beginCell().endCell())
                .set(2n, beginCell().storeMaybeRef(c2).endCell())
                .set(3n, beginCell().storeMaybeRef(c3).endCell())
            )
            .storeMaybeRef(beginCell().endCell())
            .endCell(),
        });
    }
}
