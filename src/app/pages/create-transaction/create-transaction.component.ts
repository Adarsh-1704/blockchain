import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Transaction } from 'src/blockchain';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {

  public newTx: any;
  public walletKey: any;

  constructor(private blockchainService: BlockchainService) {
    this.walletKey = blockchainService.walletKeys[0];
   }

  ngOnInit(): void {
    this.newTx = new Transaction('','',0);
  }

  createTransaction(){
    this.newTx.fromAddress = this.walletKey.publicKey;
    this.newTx.signTransaction(this.walletKey.keyObj);
    this.blockchainService.addTransaction(this.newTx);

    this.newTx = new Transaction('','',0);
  }

}
