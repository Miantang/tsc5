import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode , toNano} from 'ton-core';

const c1: Cell = Cell.fromBase64('te6ccgECCwEAARcAART/APSkE/S88sgLAQIBYgIDAgLOBAUAEaBU79qJoa4WPwIBIAYHAgEgCQoByyCMQAAAAAAAAGA+AEg10nBIJJfBODTH/QE9ATUMCPAAI4cECZfBiBu8tDIINDtHu1T+wTtRNDUMHEB8AHtVODtRNDTH1NRufLRkFNRvOMCMzNRMrqd1DAC0F4xE/AD8AHtVOBfBoAgADQByMsfzMmAAzCRu8tDIJNDtHu1TBPsEIoAg9A5vofLhkCDHAPLRkdMf9AQwBNQwji4kbrOYJNDtHu1T8ALeUxOAIPQOb6EhxwDy0ZKXMjTTH/QEMJUw8sDIBOJTFboV5jEzMdAUEDVBUPAD8AHtVAABIAAXF8E0NcLH6TIyx/Jg');
const c2: Cell = Cell.fromBase64('te6ccgECEQEAAU4AART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgIBIAYHABPXaiaEAQa5DqGEAgEgCAkCASALDAHLIIxAAAAAAAAAYD4ASDXScEgkl8E4NMf9AT0BNQwI8AAjhwQJl8GIG7y0Mgg0O0e7VP7BO1E0NQwcQHwAe1U4O1E0NMfU1G58tGQU1G84wIzM1Eyup3UMALQXjET8APwAe1U4F8GgCgANAHIyx/MyYADMJG7y0Mgk0O0e7VME+wQigCD0Dm+h8uGQIMcA8tGR0x/0BDAE1DCOLiRus5gk0O0e7VPwAt5TE4Ag9A5voSHHAPLRkpcyNNMf9AQwlTDywMgE4lMVuhXmMTMx0BQQNUFQ8APwAe1UAAEgACEbDEB0NcLHwHTHzCgyMsfyYAARvVO/aiaGuFj8AgEgDxAAEbjffwBNDXCx+AATu0D4IBjfftQ9iA==');
const c3: Cell = Cell.fromBase64('te6ccgECEQEAAVwAART/APSkE/S88sgLAQIBYgIDAgLNBAUCASANDgIBIAYHABPXaiaEAQa5DqGEAgEgCAkCASALDAHLIIxAAAAAAAAAYD4ASDXScEgkl8E4NMf9AT0BNQwI8AAjhwQJl8GIG7y0Mgg0O0e7VP7BO1E0NQwcQHwAe1U4O1E0NMfU1G58tGQU1G84wIzM1Eyup3UMALQXjET8APwAe1U4F8GgCgANAHIyx/MyYADMJG7y0Mgk0O0e7VME+wQigCD0Dm+h8uGQIMcA8tGR0x/0BDAE1DCOLiRus5gk0O0e7VPwAt5TE4Ag9A5voSHHAPLRkpcyNNMf9AQwlTDywMgE4lMVuhXmMTMx0BQQNUFQ8APwAe1UABU0NcLH6dkyMsnyYAAhGwxAdDXCycB0ycwoMjLJ8mAAEb1Tv2omhrhY/AIBIA8QABG4338ATQ1wsngAG7tA+CAY337UPYgGSpBI');

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
        }).set(2n, beginCell().storeUint(2, 32).storeMaybeRef(beginCell().endCell()).endCell()).set(1n, beginCell().storeUint(2, 32).storeMaybeRef(c2).endCell());
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
            .storeRef(beginCell().storeUint(44, 32).endCell())
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
                .set(1n, beginCell().storeUint(2n, 32).storeMaybeRef(c3).endCell())
                .set(2n, beginCell().storeUint(1n, 32).storeMaybeRef(c2).endCell())
                .set(3n, beginCell().storeUint(3, 32).storeMaybeRef(beginCell().endCell()).endCell())
            )
            .storeMaybeRef(beginCell().endCell())
            .endCell(),
        });
    }
}
