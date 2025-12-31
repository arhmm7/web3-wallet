import { generateMnemonic , mnemonicToSeed} from "bip39";
import { Keypair } from "@solana/web3.js"
import {derivePath} from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58";

export const generateWalletMnemonic = ():string => {
        return generateMnemonic();
}

export const generateSolanaAccount = async (mnemonic:string,index:number) => {
        console.log(mnemonic);
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${index}'/0'`
        // @ts-ignore
        const deriveSeed = derivePath(path,seed.toString("hex")).key;
        const secret= nacl.sign.keyPair.fromSeed(deriveSeed).secretKey;
        return Keypair.fromSecretKey(secret);
}