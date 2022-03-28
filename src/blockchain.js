const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    calculateTransactionHash(){
        const payload = this.fromAddress + this.toAddress + this.amount + this.timestamp;
        return SHA256(payload).toString();
    }

    signTransaction(signKey){

        if(signKey.getPublic('hex')!==this.fromAddress){
            throw new Error("You cannot sign this transaction");
        }

        const transactionHash = this.calculateTransactionHash();
        const sign = signKey.sign(transactionHash,'base64');
        this.signature = sign.toDER('hex');

    }

    isValidTransaction(){
        if(this.fromAddress===null)
        return true;

        if(!this.signature || this.signature.length===0)
        throw new Error("No signature in this transaction");

        const key = ec.keyFromPublic(this.fromAddress,'hex');
        return key.verify(this.calculateTransactionHash(),this.signature);
    }
}

class Block{

    constructor(timestamp,transactions,previousHash=''){
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        var payload = this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
        return SHA256(payload).toString();
    }

    mineBlock(difficulty){

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
          }
      
          console.log(`Block mined: ${this.hash}`);

        // while(this.hash.substring(0,difficulty)!==difficultyString){
        //     this.nonce++;
        //     this.hash=this.calculateHash();
        // }

        // console.log("Block mined with nonce value : " + this.nonce);
    }

    hasAllValidTransactions(){
        for(var i=0;i<this.transactions.length;i++){
            if(!this.transactions[i].isValidTransaction){
                // console.log("Failed Transaction Validation:");
                // console.log(JSON.stringify(this.transactions[i],null,4));
                return false;
            }
        }
        return true;
    }
}

class Blockchain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2 ;
        // this.difficultyCharacter = "0";
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(Date.parse('2017-01-01'), [], '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(minerRewardAddress){
        this.pendingTransactions.push(new Transaction(null,minerRewardAddress,this.miningReward));

        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty,this.difficultyCharacter);

        console.log("Block successfully mined !!");
        this.chain.push(block);
        this.pendingTransactions = [];
        
    }

    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error("Transaction Invalid");
        }
        if(!transaction.isValidTransaction()){
            throw new Error("Invalid transaction");
        }
        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
          }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(var i=1;i<this.chain.length;i++){
            var currBlock = this.chain[i];
            for(var j=0;j<currBlock.transactions.length;j++){
                let transaction = currBlock.transactions[j];
                if(transaction !== null && address===transaction.fromAddress)
                balance -= transaction.amount;
                if(transaction !== null && address===transaction.toAddress)
                balance += transaction.amount;
            }
        }
        return balance; 
    }

    getAllTransactionsForWallet(address) {
        const txs = [];
    
        for (const block of this.chain) {
          for (const tx of block.transactions) {
            if (tx.fromAddress === address || tx.toAddress === address) {
              txs.push(tx);
            }
          }
        }
    
        return txs;
      }

    isBlockchainValid() {

        for(var i=1;i<this.chain.length;i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasAllValidTransactions){
                return false;
            }

            // Check the hash of current block
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                console.log("Validity failed at block : " + i + " as some data in the block has changed");
                return false;
            }

            // Compare the previous hash of current block with hash of previous block
            if(currentBlock.previousHash !== previousBlock.hash) {
                console.log("Validity failed at block : " + i + " as previous hash is not matching");
                return false;
            }
        }
        return true;
    }
}

module.exports.Transaction = Transaction;
module.exports.Block = Block;
module.exports.Blockchain = Blockchain;