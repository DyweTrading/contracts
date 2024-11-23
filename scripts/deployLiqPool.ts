import { Address, toNano } from '@ton/core';
import { LiqPool } from '../wrappers/LiqPool';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const liqPool = provider.open(LiqPool.createFromConfig({owner_address: Address.parse("0:13876f4a07d52e73a3a740b51017fb3562984fded97546b6029d47db2065b4d4")}, await compile('LiqPool')));

    await liqPool.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(liqPool.address);

    // run methods on `liqPool`
}
