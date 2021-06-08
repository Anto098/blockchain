const {Blockchain, Transaction} = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // give an elliptic curve algo

const myKey = ec.keyFromPrivate("044866e6e4dd6b90c022cedfd1a1cf02407586dca8542467eb9ab180a649ac225d6d408d37c25c9085da2614aa48a110f6ee7215fe36a4d6cf17ba19e57bd23061");
const myWalletAddress = myKey.getPublic("hex");

let antoCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10); // send 10 coins
tx1.signTransaction(myKey);
antoCoin.addTransaction(tx1);

console.log("\n starting the miner...");
antoCoin.minePendingTransactions(myWalletAddress);

console.log(`\n Balance of anto is ${antoCoin.getBalanceOfAddress(myWalletAddress)}`);

antoCoin.chain[1].transactions[0].amount = 1;

console.log(`Is chain valid? ${antoCoin.isChainValid()}`)

