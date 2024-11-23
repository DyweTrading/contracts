import { compile, NetworkProvider } from '@ton/blueprint';
import { LiqPool } from '../wrappers/LiqPool';
import { Address, toNano } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const liqPool = provider.open(LiqPool.createFromConfig({owner_address: Address.parseRaw("0:13876f4a07d52e73a3a740b51017fb3562984fded97546b6029d47db2065b4d4")}, await compile('LiqPool')));

    await liqPool.sendNumber(provider.sender(), toNano('0.123'), 123n);
}
