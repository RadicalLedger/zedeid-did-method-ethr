import * as secp256k1 from 'secp256k1';
import Base58 from 'base-58';

export default class EthrMethod {
    /**
     *
     * @param node BIP32Interface
     * @returns {KeysInterface} { did, address, privateKey, publicKey, chainCode, didDocument }.
     */
    async getKeys(node: BIP32Interface): Promise<KeysInterface> {
        const privateKey = node.privateKey?.toString('hex');
        const chainCode = node.chainCode?.toString('hex');
        const address = node.publicKey?.toString('hex');
        const did = `did:ethr:0x${address}`;
        const verificationKey: VerificationKeyInterface = await this.createVerificationMethod(
            privateKey as string
        );
        const publicKey = Buffer.from(Base58.decode(verificationKey.publicKeyBase58)).toString(
            'hex'
        );

        const { didDocument } = await this.getDocument(privateKey as string);

        return { did, address, privateKey, publicKey, chainCode, didDocument };
    }

    /**
     *
     * @param privateKey - private key as a hex string
     * @returns {CreateDidDocumentInterface}
     */
    async getDocument(privateKey: string): Promise<CreateDidDocumentInterface> {
        const verificationKey: VerificationKeyInterface =
            await this.createVerificationMethod(privateKey);

        const didDocument = {
            '@context': 'https://w3id.org/did/v1',
            id: verificationKey.id,
            publicKey: [verificationKey],
            authentication: [verificationKey.controller],
            assertionMethod: [verificationKey.controller],
            service: []
        };

        return { didDocument };
    }

    /**
     *
     * @param seed - seed as a hex string
     * @param includePrivateKey - include private key
     * @returns {VerificationKeyInterface}
     */
    async createVerificationMethod(
        seed: string,
        includePrivateKey: boolean = false
    ): Promise<VerificationKeyInterface> {
        let jwk: VerificationKeyInterface = {
            id: '',
            controller: '',
            type: 'EcdsaSecp256k1Signature2019',
            publicKeyBase58: ''
        };
        const privateKey = new Uint8Array(Buffer.from(seed, 'hex'));
        const verified = secp256k1.privateKeyVerify(privateKey);

        if (verified) {
            const publicKey = secp256k1.publicKeyCreate(privateKey, true);
            jwk.publicKeyBase58 = Base58.encode(publicKey);
            jwk.id = `did:ethr:0x${Buffer.from(publicKey).toString('hex')}`;
            jwk.controller = `${jwk.id}#controller`;

            if (includePrivateKey) {
                jwk.privateKeyBase58 = Base58.encode(privateKey);
            }
        }

        return jwk;
    }
}
