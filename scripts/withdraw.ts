import { compile, NetworkProvider } from '@ton/blueprint'
import { LiqPool } from '../wrappers/LiqPool'
import { Address, toNano } from '@ton/core'

export async function run(provider: NetworkProvider){
	const liqPool = provider.open(
		LiqPool.createFromConfig({owner_address: Address.parseRaw("0:1Th29KB9Uuc6OnQLUQF_s1YphP3tl1RrYCnUfbIGW01IUZ")}, await compile('LiqPool'))
	);

	await liqPool.sendWithdraw(provider.sender(), toNano('0.2'), 12n);
}
