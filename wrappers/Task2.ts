import { Address, beginCell, Dictionary,  Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';
import { randomAddress } from '@ton-community/test-utils';

export type Task2Config = {};

export function task2ConfigToCell(config: Task2Config): Cell {
    const address = randomAddress();
    return beginCell()//.endCell();
    .storeAddress(address)
    .storeDict(Dictionary.empty())
    .endCell();
}

export class Task2 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task2(address);
    }

    static createFromConfig(config: Task2Config, code: Cell, workchain = 0) {
        const data = task2ConfigToCell(config);
        const init = { code, data };
        return new Task2(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDict(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                .storeUint(0x66666666, 32)
                .storeAddress(via.address)
                .endCell()
            })
    }

    async getState(provider: ContractProvider) {
        const {stack} = await provider.get('get_users', []);
        return {
            cell: stack.readCell()
        }
        // return await provider.getState()
    }
}
