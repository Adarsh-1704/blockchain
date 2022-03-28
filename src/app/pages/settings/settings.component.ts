import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public blockchain: any;

  constructor(private blockchainService: BlockchainService) { 
    this.blockchain = this.blockchainService.blockchainInstance;
  }

  ngOnInit(): void {
  }

}
