import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode , toNano} from 'ton-core';

const c1: Cell = Cell.fromBase64('te6ccgEBCAEAWAABFP8A9KQT9LzyyAsBAgFiAgMCAs4EBQAHoFTu/QA9SAINch9AQx9AQx1DDtRNDUMAHQFEMw8AN+AfAC7VSAIBIAYHAAkMcjMyYAAXF8E0NcLH6TIyx/Jg');
const c2: Cell = Cell.fromBase64('te6ccgEBDgEAiwABFP8A9KQT9LzyyAsBAgFiAgMCAs4EBQIBIAoLAgEgBgcCASAICQA9IAg1yH0BDH0BDHUMO1E0NQwAdAUQzDwAX4B8ALtVIAAhGwxAdDXCx8B0x8woMjLH8mAACQxyMzJgAAs7UTQ1DCAAB71Tu/QCASAMDQARuN9/AD0NcLH4ABO7QPggGN9+1D2I');
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
}
