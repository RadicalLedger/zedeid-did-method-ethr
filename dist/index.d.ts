export default class EthrMethod {
    /**
     *
     * @param node BIP32Interface
     * @returns {KeysInterface} { did, address, privateKey, publicKey, chainCode, didDocument }.
     */
    getKeys(node: BIP32Interface): Promise<KeysInterface>;
    /**
     *
     * @param privateKey - private key as a hex string
     * @param did - ethereum DID address
     */
    getDocument(privateKey: string, did: string): Promise<CreateDidDocumentInterface>;
    /**
     *
     * @param seed - seed as a hex string
     * @param includePrivateKey - include private key
     * @returns
     */
    createVerificationMethod(
        seed: string,
        includePrivateKey?: boolean
    ): Promise<VerificationKeyInterface>;
}