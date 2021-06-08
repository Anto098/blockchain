const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        // index (optional) = index of the block on the chain
        // timestamp : when was the block created
        // data : any type of data we want to associate with the block
        // if it's a transaction, amount, receiver, sender
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "08/06/2021", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash()
        this.chain.push(newBlock)
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


let myCoin = new Blockchain();
myCoin.addBlock(new Block(1,"08/06/2021", {amount: 4}));
myCoin.addBlock(new Block(1,"08/06/2021", {amount: 4}));

console.log(`Is blockchain valid? ${myCoin.isChainValid()}`);

myCoin.chain[1].data = { amount:100 };
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();


console.log(`Is blockchain valid? ${myCoin.isChainValid()}`);
// console.log(JSON.stringify(myCoin, null, 4));
