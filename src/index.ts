import { EcdsaSecp256k1VerificationKey2019 } from '@bloomprotocol/ecdsa-secp256k1-verification-key-2019';
import Base58 from 'base-58';

export default class EthrMethod {
    /**
     *
     * @param node BIP32Interface
     * @returns {KeysInterface} { did, address, privateKey, publicKey, chainCode, verificationKey }.
     */
    async getKeys(node: BIP32Interface): Promise<KeysInterface> {
        const privateKey = node.privateKey?.toString('hex');
        const chainCode = node.chainCode?.toString('hex');
        const address = node.publicKey?.toString('hex');
        const did = `did:ethr:0x${address}`;
        const verificationKey: VerificationKeyInterface = await createVerificationMethod(
            privateKey,
            did
        );
        const publicKey = Buffer.from(Base58.decode(verificationKey.publicKeyBase58)).toString(
            'hex'
        );

        return { did, address, privateKey, publicKey, chainCode, verificationKey };
    }
}

export async function createVerificationMethod(seed: any, did: string) {
    const k = await EcdsaSecp256k1VerificationKey2019.generate({
        id: did,
        controller: `${did}#controller`,
        seed: new Uint8Array(Buffer.from(seed, 'hex'))
    });

    let jwk = k.export({
        privateKey: true,
        publicKey: true
    });

    return jwk;
}
