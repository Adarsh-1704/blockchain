import { Injectable } from '@angular/core';
import {Blockchain} from '../../blockchain';
import * as elliptic from 'elliptic';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance = new Blockchain();
  public walletKeys : Array<WalletKey> = [];

  constructor() {

    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('test-wallet-address');
    this.generateWalletKeys();

  }

  public getBlocks(){
    return this.blockchainInstance.chain;
  }

  public addressIsFromCurrentUser(address: any){
    return address===this.walletKeys[0].publicKey;
  }

  public addTransaction(tx: any){
    this.blockchainInstance.addTransaction(tx);
  }

  public getPendingTransactions() {
    return this.blockchainInstance.pendingTransactions;
  }

  public minePendingTransactions() {
    this.blockchainInstance.minePendingTransactions(this.walletKeys[0].publicKey);
  }

  public generateWalletKeys(){
    var EC = elliptic.ec;
    var ec = new EC('secp256k1');

    const key = ec.genKeyPair();

    this.walletKeys.push({
      keyObj : key,
      privateKey : key.getPrivate('hex'),
      publicKey : key.getPublic('hex')
    });
  }
}



export interface WalletKey {
  keyObj : any;
  publicKey : String;
  privateKey : String;
}