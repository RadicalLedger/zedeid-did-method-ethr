# DID Method Ethr

Library for generating and working with Secp256k1VerificationKey2018 key pairs.

# Installation

* Node.js 16.0+ is required.

To install locally (for development):

```bash
git clone  https://github.com/RadicalLedger/zedeid-did-method-ethr.git
cd zedeid-did-method-ethr

yarn install or npm install
yarn test or npm run test
```

## Usage

### Initializing and Generating Keys

Generate ethr method key pairs with `getKeys` method. It can be used to generate key pairs for given node (bip32).

```ts
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import EthrMethod from 'zedeid-did-method-ethr';

const seed = 'your-seed';

const bip32 = BIP32Factory(ecc);
const masterNode = bip32.fromSeed(Buffer.from(seed, 'hex'));

const ethrMethod = new EthrMethod();
const keys = await ethrMethod.getKeys(masterNode);

console.log(keys);
```

### Generating DID Documents

Generate did document with `getDocument` method.

```ts
const privateKey = 'your-private-key-as-hex-string';
const didDocument = await ethrMethod.getDocument(privateKey);

console.log(didDocument);
```

### Generate Verification Key 

Generate verification key with `createVerificationMethod` method for a given seed.

```ts
const seed = 'your-seed-as-hex-string';
const includePrivateKey = true; // (optional) to include the private key in the verification method
const verificationKey = await ethrMethod.createVerificationMethod(seed, includePrivateKey);

console.log(verificationKey);
```

