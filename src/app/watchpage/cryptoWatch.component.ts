import {Component, OnInit, ViewChild} from "@angular/core";
import {BlockChainService} from "../service/block-chain.service";
import {CryptoData} from "../model/cryptoData.model";
import {SelectItem} from "primeng/components/common/selectitem";
import {LogService} from "../service/log.service";


@Component({
  selector: 'crypto-watch',
  templateUrl: './cryptoWatch.component.html',
  styleUrls: ['./cryptoWatch.component.css']
})
export class CryptoWatchComponent implements OnInit {

  private _addressInput: string
  private _accountNameInput: string
  private _selectedCrypto: string

  private _tooltipAddress: string

  private _cryptoOptions: SelectItem[] = []


  constructor(private _blockChainService: BlockChainService,
              private _logService: LogService) {
  }

  ngOnInit() {
    this._blockChainService.cryptoList.forEach((cryptosTiker, key) => {
      this._cryptoOptions.push({label: cryptosTiker.coinName, value: cryptosTiker.coinType})
    })
  }

  private onAddAddress() {
    this._blockChainService.addToCryptoDataList(this._addressInput, this._accountNameInput, this._selectedCrypto)

    this._addressInput = ''
    this._accountNameInput = ''
    this._selectedCrypto = ''

  }

  private removeAddress(cryptoData: CryptoData) {
    this._blockChainService.removeFromCryptoDataList(cryptoData)
  }

  private calculateTotals(): number {
    let total = 0

    this._blockChainService.cryptoDataList.forEach((cryptoData) => {
      total += cryptoData.dollarValue
    })

    return total
  }

  private setTooltipAddress(address) {
    this._tooltipAddress = address
  }

  private calculateSubtotalBallance(coinType: string): number {
    let balance: number = 0

    for (let i = 0; i < this._blockChainService.cryptoDataList.length; i++) {
      if (this._blockChainService.cryptoDataList[i].coinType === coinType && this._blockChainService.cryptoDataList[i].balance) {
        balance += this._blockChainService.cryptoDataList[i].balance
      }
    }

    return balance
  }

  private calculateSubtotalDollarValue(coinType: string): number {
    let subtotal: number = 0

    for (let i = 0; i < this._blockChainService.cryptoDataList.length; i++) {
      if (this._blockChainService.cryptoDataList[i].coinType === coinType && this._blockChainService.cryptoDataList[i].dollarValue) {
        subtotal += this._blockChainService.cryptoDataList[i].dollarValue
      }
    }

    return subtotal
  }

}
