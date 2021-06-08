const {Blockchain, Transaction} = require("./blockchain");

let antoCoin = new Blockchain();

antoCoin.createTransaction(new Transaction("address1", "address2", 100));
antoCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\n starting the miner...");
antoCoin.minePendingTransactions("antos-address");

console.log(`\n Balance of anto is ${antoCoin.getBalanceOfAddress("antos-address")}`);

console.log("\n starting the miner...");
antoCoin.minePendingTransactions("antos-address");

console.log(`\n Balance of anto is ${antoCoin.getBalanceOfAddress("antos-address")}`);