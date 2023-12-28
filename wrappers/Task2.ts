import { Address, beginCell, Dictionary, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleReader } from 'ton-core';
import { randomAddress } from '@ton-community/test-utils';

export type Task2Config = {
    admin: Address,
};

export function task2ConfigToCell(config: Task2Config): Cell {
    return beginCell()//.endCell();
    .storeAddress(config.admin)
    .storeDict(Dictionary.empty())
    .endCell();
}

function parseTupleArrayAuto(tr: TupleReader | null) {
    return tr;
    if(!tr) {
        return null;
    }
    // return new Array(Number(tr.remaining)).fill(0).map((_: any, index: number) => {
    //     return tr.readNumber();
    // })
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
    async sendSplit(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                .storeUint(0x068530b3, 32)
                .storeUint(0x1414, 64)
                .endCell()
            })
    }

    async sendAddUser(provider: ContractProvider, via: Sender, value: bigint, addr: Address, share: number = 99) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(0x368ddef3, 32)
            .storeUint(0x1415, 64) // query_id
            .storeAddress(addr)
            .storeUint(share, 32)
            .endCell()
        })
    }

    async sendDelUser(provider: ContractProvider, via: Sender, value: bigint, addr: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
            .storeUint(0x278205c8, 32)
            .storeUint(0x1416, 64) // query_id
            .storeAddress(addr)
            .endCell()
        })
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

    async getAdmin(provider: ContractProvider) {
        const {stack} = await provider.get('get_admin', []);
        // const addr = stack.readAddress();
        // const list = stack.readTuple();
        return [stack.readAddress(), stack.readAddress(), stack.readBigNumberOpt(), stack.readBigNumberOpt(), stack.readBoolean()];
        // return [addr, parseTupleArrayAuto(stack.readTuple())];
        // return [addr, [list.readBigNumberOpt(), list.readBigNumberOpt(), list.readBigNumberOpt(), list.readAddress()]];
        // return await provider.getState()
    }

    async getUsers(provider: ContractProvider) {
        const {stack} = await provider.get('get_users', []);
        return stack.readCellOpt()?.asSlice().loadDictDirect({
            bits: 256, parse: (src) => src, serialize: (src) => src
        }, {
            serialize: (src, builder) => builder.storeUint(src as number, 32), 
            parse: (slice) => slice.loadUint(32),
        })
    }

    async getUserShare(provider: ContractProvider, addr: Address) {
        const {stack} = await provider.get('get_user_share', [{type: 'slice', cell: beginCell().storeAddress(addr).endCell()}]);
        return stack.readNumberOpt();
    }
}
