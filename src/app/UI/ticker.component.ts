import {Component} from "@angular/core";
import {BlockChainService} from "../service/block-chain.service";
import {Crypto} from "../model/crypto.model";


@Component({
  selector: 'ticker',
  template: `

    <p-carousel headerText="Ticker" [value]="getCryptoTikerArray()" numVisible="6" firstVisible="0" pageLinks="4">

      <ng-template let-ticker pTemplate="item">

        <p-panel [header]="ticker.coinName" [style]="{'text-align':'center'}">
          <img src="../../assets/icons/{{ticker.coinType}}.png" height="32" width="32">&nbsp;
          {{ticker.dollarValue}}
        </p-panel>

      </ng-template>

    </p-carousel>
  `,
  styles: []
})

export class TickerComponent {

  constructor(private _blockChainService: BlockChainService) {
  }

  getCryptoTikerArray(): Crypto[] {
    return Array.from(this._blockChainService.cryptoList.values())
  }

}
