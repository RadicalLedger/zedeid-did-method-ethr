export default class EthrMethod {
    /**
     *
     * @param node BIP32Interface
     * @returns {KeysInterface} { did, address, privateKey, publicKey, chainCode, verificationKey }.
     */
    getKeys(node: BIP32Interface): Promise<KeysInterface>;
}
export declare function createVerificationMethod(seed: any, did: string): Promise<{
    '@context'?: string | undefined;
    type: string;
    id: string;
    controller: string;
    publicKeyBase58?: string | undefined;
    privateKeyBase58?: string | undefined;
    revoked?: boolean | undefined;
}>;
