const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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
        // make block from pending transactions
        // mine the block
        // put the block on the chain
        // make new transaction with reward for miner, put it in pendingTransactions
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log(`Block successfully mined!`);
        this.chain.push(block);

        this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward) ];
    }

    createTransaction(transaction){
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