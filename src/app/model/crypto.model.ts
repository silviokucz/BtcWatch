

export class Crypto {
  public coinType: string
  public dollarValue: number = 0
  public coinName:string

  public timeout = 10
  public nextEntry4Update = 0

  constructor(coinType: string, coinName: string) {
    this.coinType = coinType
    this.coinName = coinName
  }
}

