const EC = require("elliptic").ec;
const ec = new EC("secp256k1"); // give an elliptic curve algo

const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTransaction(signingKey){
        if(signingKey.getPublic("hex") !== this.fromAddress){
            throw new Error("You cannot sign transactions for other wallets!");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64"); // sign the transaction in base64
        this.signature = sig.toDER("hex");
    }

    isValid(){
        if(this.fromAddress === null) return true;
        if(!this.signature || this.signature.length === 0){ // shouldn't this be and instead of or??
            throw new Error("No signature in this transaction");
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = ''){
        // index (optional) = index of the block on the chain
        // timestamp : when was the block created
        // data : any type of data we want to associate with the block
        // if it's a transaction, amount, receiver, sender
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            // Check if hash has a certain number of 0s specified by the `difficulty` argument
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`)
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}


class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100; // 100 coins if you mine a new block successfully
    }

    createGenesisBlock(){
        return new Block("08/06/2021", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null,miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx)
        
        // make block from pending transactions
        // mine the block
        // put the block on the chain
        // make new transaction with reward for miner, put it in pendingTransactions
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log(`Block successfully mined!`);
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error("Transaction must include from and to address");
        }

        if(!transaction.isValid()){
            throw new Error("Cannot add invalid transaction to chain");
        }

        // put transaction on the pendingTransactions array
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const t of block.transactions){
                if(t.fromAddress === address){
                    balance -= t.amount;
                }
                if(t.toAddress === address){
                    balance += t.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length ; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(!currentBlock.hasValidTransactions())
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            else if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;