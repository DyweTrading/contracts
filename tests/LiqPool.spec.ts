import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, toNano } from '@ton/core';
import { LiqPool } from '../wrappers/LiqPool';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('LiqPool', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('LiqPool');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let liqPool: SandboxContract<LiqPool>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        liqPool = blockchain.openContract(LiqPool.createFromConfig({owner_address: Address.parse("0QATh29KB9Uuc6OnQLUQF_s1YphP3tl1RrYCnUfbIGW01IUZ")}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await liqPool.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: liqPool.address,
            deploy: true,
        });
    });
    
    it('should deploy', async () => {});

    it('should deposit', async () => {
        let total_liq_before  = await liqPool.getLiquidity();
        let result = await liqPool.sendNumber(deployer.getSender(), toNano('0.01'), 123n); 
        console.log('expect 1')
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: liqPool.address,
            success: true
        })
        expect(await liqPool.getLiquidity()).toBeGreaterThan(total_liq_before);
        
        const total_liq_before2 = await liqPool.getLiquidity();
        const result2 = await liqPool.sendNumber(deployer.getSender(), toNano('0.01'), 123n); 
        expect(result2.transactions).toHaveTransaction({
            from: deployer.address,
            to: liqPool.address,
            success: true 
        });
        expect(await liqPool.getLiquidity()).toEqual(total_liq_before2);
    });

    it('should not withdraw', async () => {
        const result = await liqPool.sendWithdraw(deployer.getSender(), toNano('0.02'), 12n); 
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: liqPool.address,
            success: false,
        })
    })
    it('should withdraw', async () => {
        const result = await liqPool.sendWithdraw(deployer.getSender(), toNano('0.02'), 12n); 
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: liqPool.address,
            success: false,
        })
    })
});
