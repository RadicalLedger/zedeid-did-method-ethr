"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVerificationMethod = void 0;
const ecdsa_secp256k1_verification_key_2019_1 = require("@bloomprotocol/ecdsa-secp256k1-verification-key-2019");
const base_58_1 = __importDefault(require("base-58"));
class EthrMethod {
    /**
     *
     * @param node BIP32Interface
     * @returns {KeysInterface} { did, address, privateKey, publicKey, chainCode, verificationKey }.
     */
    async getKeys(node) {
        var _a, _b, _c;
        const privateKey = (_a = node.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
        const chainCode = (_b = node.chainCode) === null || _b === void 0 ? void 0 : _b.toString('hex');
        const address = (_c = node.publicKey) === null || _c === void 0 ? void 0 : _c.toString('hex');
        const did = `did:ethr:0x${address}`;
        const verificationKey = await createVerificationMethod(privateKey, did);
        const publicKey = Buffer.from(base_58_1.default.decode(verificationKey.publicKeyBase58)).toString('hex');
        return { did, address, privateKey, publicKey, chainCode, verificationKey };
    }
}
exports.default = EthrMethod;
async function createVerificationMethod(seed, did) {
    const k = await ecdsa_secp256k1_verification_key_2019_1.EcdsaSecp256k1VerificationKey2019.generate({
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
exports.createVerificationMethod = createVerificationMethod;
//# sourceMappingURL=index.js.map