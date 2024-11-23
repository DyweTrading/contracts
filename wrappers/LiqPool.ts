import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode} from '@ton/core';

export type LiqPoolConfig = {
    owner_address: Address
};
//0:8252b7b4f0ea5adeed8e9002d31dc6f475ba04f85527932a0ea895533b58791c
export function liqPoolConfigToCell(config: LiqPoolConfig): Cell {
    return beginCell().storeUint(0, 64).storeAddress(config.owner_address).endCell();
}

export class LiqPool implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new LiqPool(address);
    }

    static createFromConfig(config: LiqPoolConfig, code: Cell, workchain = 0) {
        const data = liqPoolConfigToCell(config);
        const init = { code, data };
        return new LiqPool(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendNumber(provider: ContractProvider, via: Sender, value: bigint, number: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(number, 64).endCell(),
        });
    }
    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint, number: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).storeUint(number, 64).endCell(),
        });
    }
    async getLiquidity(provider: ContractProvider){
        const result = (await provider.get('getLiquidity', [])).stack;
        return result.readBigNumber();    
    }
    async getOwner(provider: ContractProvider){
        const result = (await provider.get('getOwner', [])).stack;
        return result.readAddress();    
    }
}
