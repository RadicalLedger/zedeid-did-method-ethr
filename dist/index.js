'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      }
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const secp256k1 = __importStar(require('secp256k1'));
const base_58_1 = __importDefault(require('base-58'));
class EthrMethod {
    /**
     *
     * @param node BIP32Interface
     * @returns {KeysInterface} { did, address, privateKey, publicKey, chainCode, didDocument }.
     */
    async getKeys(node) {
        var _a, _b, _c;
        const privateKey =
            (_a = node.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
        const chainCode =
            (_b = node.chainCode) === null || _b === void 0 ? void 0 : _b.toString('hex');
        const address =
            (_c = node.publicKey) === null || _c === void 0 ? void 0 : _c.toString('hex');
        const did = `did:ethr:0x${address}`;
        const verificationKey = await this.createVerificationMethod(privateKey);
        const publicKey = Buffer.from(
            base_58_1.default.decode(verificationKey.publicKeyBase58)
        ).toString('hex');
        const { didDocument } = await this.getDocument(privateKey);
        return { did, address, privateKey, publicKey, chainCode, didDocument };
    }
    /**
     *
     * @param privateKey - private key as a hex string
     * @returns {CreateDidDocumentInterface}
     */
    async getDocument(privateKey) {
        const verificationKey = await this.createVerificationMethod(privateKey);
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
    async createVerificationMethod(seed, includePrivateKey = false) {
        let jwk = {
            id: '',
            controller: '',
            type: 'EcdsaSecp256k1Signature2019',
            publicKeyBase58: ''
        };
        const privateKey = new Uint8Array(Buffer.from(seed, 'hex'));
        const verified = secp256k1.privateKeyVerify(privateKey);
        if (verified) {
            const publicKey = secp256k1.publicKeyCreate(privateKey, true);
            jwk.publicKeyBase58 = base_58_1.default.encode(publicKey);
            jwk.id = `did:ethr:0x${Buffer.from(publicKey).toString('hex')}`;
            jwk.controller = `${jwk.id}#controller`;
            if (includePrivateKey) {
                jwk.privateKeyBase58 = base_58_1.default.encode(privateKey);
            }
        }
        return jwk;
    }
}
exports.default = EthrMethod;
//# sourceMappingURL=index.js.map
