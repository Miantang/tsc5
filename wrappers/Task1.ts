import { Address, beginCell, BitString, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';
import { randomAddress } from '@ton-community/test-utils';

export type Task1Config = {};

export function task1ConfigToCell(config: Task1Config): Cell {
    const address = randomAddress();
    return beginCell()//.endCell();
    .storeUint(0x111123334, 256)
    .storeUint(0x12345, 32)
    .storeAddress(address)
    .storeUint(0x3244, 32)
    .endCell();
}

export class Task1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task1(address);
    }

    static createFromConfig(config: Task1Config, code: Cell, workchain = 0) {
        const data = task1ConfigToCell(config);
        const init = { code, data };
        return new Task1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendUpdate(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                .storeUint(0x9df10277, 32)
                .storeUint(9988998, 64)
                .storeBits(new BitString(Buffer.from('123'), 0, 512))
                .storeRef(beginCell().storeUint(0x22222222, 32).storeUint(0x33333333, 32).endCell())
                .endCell()
            })
    }
    async getState(provider: ContractProvider) {
        const {stack} = await provider.get('get_d', []);
        return {
            cell: stack.readCell()
        }
        // return await provider.getState()
    }
    // async sendExpUpdate(provider: ContractProvider) {
    //     await provider.external(
    //         beginCell()
    //         .storeUint(0x9df10277, 32)
    //         .storeBits(new BitString(Buffer.from('123'), 0, 512))
    //         .storeRef(beginCell().storeUint(0x22222222, 32).storeUint(0x33333333, 32).endCell())
    //         .endCell()
    //     )
    // }
    
}
