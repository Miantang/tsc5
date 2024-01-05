import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode , toNano} from 'ton-core';

const c1: Cell = Cell.fromBase64('te6ccgECDQEAATMAART/APSkE/S88sgLAQIBYgIDAgLNBAUAEaBU79qJoa4WPwIBIAYHABPXaiaEAQa5DqGEAgEgCAkCASALDAHJCDXScEgkl8E4NMf9AT0BNQwI8AAjiMxMiBus5gg0O0e7VP7BJEw4u1E0NQwAdAUQzDwAXEB8ALtVODtRNDTH1NRufLRkFNRvOMCMGwiUSK6n/AEAdAUEDVBUPAB8ALtVJJfBeKAKABcXwTQ1wsfpMjLH8mAA5CRu8tDIJNDtHu1TBPsEIoAg9A5vofLhkCDHAPLRkCDHAvLRkNMf9AQwBNQwjjQkbrOYJNDtHu1T8APeUxOAIPQOb6EhxwDy0ZAhxwLy0ZCXMjTTH/QEMJUw8sDIBOJTFboV5jEzMdAUEDVBUPAB8ALtVAANAHIyx/MyYAABIA==');
const c2: Cell = Cell.fromBase64('te6ccgECDwEAAVMAART/APSkE/S88sgLAQIBYgIDAgLOBAUCASALDAIBIAYHAgEgCQoByQg10nBIJJfBODTH/QE9ATUMCPAAI4jMTIgbrOYINDtHu1T+wSRMOLtRNDUMAHQFEMw8AFxAfAC7VTg7UTQ0x9TUbny0ZBTUbzjAjBsIlEiup/wAwHQFBA1QVDwAfAC7VSSXwXigCAAhGwxAdDXCx8B0x8woMjLH8mAA6CRu8tDIJNDtHu1TBPsEIoAg9A5vofLhkCDHAPLRkCDHAvLRkNMf9AQwBNQwjjYkbrOaJNDtHu1T+EHaEd5TE4Ag9A5voSHHAPLRkCHHAvLRkJcyNNMf9AQwlTDywMgE4lMVuhXmMTMx0BQQNUFQ8AHwAu1UAA0AcjLH8zJgABM7UTQgCDXIdQwgABG9U79qJoa4WPwCASANDgARuN9/AD0NcLH4ABO7QPggGN9+1D2I');
const c3: Cell = Cell.fromBase64('te6ccgECEQEAAU4AART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgIBIAYHABPXaiaEAQa5DqGEAgEgCAkCASALDAHJCDXScEgkl8E4NMf9AT0BNQwI8AAjiMxMiBus5gg0O0e7VP7BJEw4u1E0NQwAdAUQzDwAXEB8ALtVODtRNDTH1NRufLRkFNRvOMCMGwiUSK6n/AEAdAUEDVBUPAB8ALtVJJfBeKAKACEbDEB0NcLJwHTJzCgyMsnyYACyJG7y0Mgk0O0e7VME+wQigCD0Dm+hMNMf9AQwBNQwk1MVuo4lJG6zmCTQ7R7tU/AD3lMTgCD0Dm+hlzI00x/0BDCVMPLAyATiBOgxMzHQFBA1QVDwAfAC7VQADQByMsfzMmAAFTQ1wsfp2TIyyfJgABG9U79qJoa4WPwCASAPEAARuN9/AE0NcLJ4ABu7QPggGN9+1D2IBkqQSA==');

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
        }).set(2n, beginCell().storeUint(2, 32).storeMaybeRef().endCell()).set(1n, beginCell().storeUint(2, 32).storeMaybeRef(c2).endCell());
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
            .storeRef(beginCell().endCell())
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
                serialize: (src: any, builder) => builder.storeMaybeRef(src), 
                parse: (slice) => slice.loadMaybeRef(),
            })
                .set(1n, beginCell().storeUint(2, 32).storeMaybeRef().endCell())
                .set(2n, beginCell().storeUint(3, 32).storeMaybeRef(c3).endCell())
                .set(3n, beginCell().storeUint(3, 32).storeMaybeRef().endCell())
            )
            .storeMaybeRef(beginCell().endCell())
            .endCell(),
        });
    }
}
