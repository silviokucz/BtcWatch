import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {LocalStorageService} from "./localStorage.service";
import {CryptoData} from "../model/cryptoData.model";
import {LogService} from "./log.service";
import {Crypto} from "../model/crypto.model";


@Injectable()
export class BlockChainService {

  // storage for coin market values and fetch speed parameters
  public cryptoList: Map<string, Crypto>
  public updateFrequency = 180

  // storage for the portfolio data
  public cryptoDataList: CryptoData[] = []

  // for ticker
  public tickerFrequency = 120
  private _tickerTimeout = 10

  // for unit test to stop the timer
  private _timer: any

  constructor(private _http: Http, private _localStorageService: LocalStorageService, private _logService: LogService) {

    // retrieve the supported list and update if needed
    let tempcryptoList = new Map()
    tempcryptoList.set('bitcoin', new Crypto('bitcoin', 'Bitcoin'))
    tempcryptoList.set('ethereum', new Crypto('ethereum', 'Ethereum'))
    tempcryptoList.set('bitcoin-cash', new Crypto('bitcoin-cash', 'Bcash'))
    tempcryptoList.set('litecoin', new Crypto('litecoin', 'LiteCoin'))
    tempcryptoList.set('dash', new Crypto('dash', 'Dash'))
    this.cryptoList = this._localStorageService.retrieveMap('cryptoList')
    if (!this.cryptoList || this.cryptoList.size !== tempcryptoList.size) {
      this.cryptoList = tempcryptoList
    }

    try {
      // let s = this._localStorageService.getCookie('btcAddressList')
      let s = this._localStorageService.retrieveObject('btcAddressList')
      if (s) {
        this.cryptoDataList = s
      }

    }
    catch (error) {
      this._logService.logError(`ERROR: BlockChainService - ${error.message}`)
    }


    this.everySecond()
  }


  // for exporting the list
  public getList() {
    let res = ''
    let s = this._localStorageService.retrieveObject('btcAddressList')
    if (s) {
      res = JSON.stringify(s)
    }

    return res
  }


  // for importing the list
  public setlist(newList: string): boolean {

    try {
      let obj = JSON.parse(newList)
      if (!obj) {
        return false
      }

      this.cryptoDataList = obj
      this.storeCryptoDataList()
    }
    catch (error) {
      this._logService.logError('Error importing list: ' + error.message)
      return false
    }

    return true
  }


  public removeFromCryptoDataList(cryptoData: CryptoData) {
    let index = this.cryptoDataList.findIndex((c) => c.address === cryptoData.address)

    if (index !== -1) {
      // using the slice operator to create a new array so primeng datatable updates
      this.cryptoDataList.splice(index, 1)
      this.cryptoDataList = this.cryptoDataList.slice()

      this.storeCryptoDataList()
    }

  }


  public addToCryptoDataList(address: string, accountName: string, coinType: string) {

    //todo: check if address already in list
    // todo: check if address is valid

    let cryptosData = new CryptoData()
    cryptosData.address = address
    cryptosData.accountName = accountName
    cryptosData.coinType = coinType
    cryptosData.balance = 0
    cryptosData.dollarValue = 0

    // using the spread operator to create a new array so primeng datatable updates
    //let index = this._blockChainService.cryptoDataList.push(cryptosData) - 1
    this.cryptoDataList = [...this.cryptoDataList, cryptosData]

    this.storeCryptoDataList()
  }


  private storeCryptoDataList() {
    this._localStorageService.storeObject('btcAddressList', this.cryptoDataList)
  }


  private getBalance(cryptoData: CryptoData) {

    // decode url based on coin type
    let url = ''
    switch (cryptoData.coinType) {
      case 'bitcoin':
        url = `https://blockchain.info/q/addressbalance/${cryptoData.address}?cors=true`
        break
      case 'ethereum':
        url = `https://api.blockcypher.com/v1/eth/main/addrs/${cryptoData.address}/balance`
        break
      case 'litecoin':
        url = `https://api.blockcypher.com/v1/ltc/main/addrs/${cryptoData.address}/balance`
        break
      case 'bitcoin-cash':
        url = `https://blockdozer.com/insight-api/addr/${cryptoData.address}/balance`
        break
      case 'dash':
        url = `https://api.blockcypher.com/v1/dash/main/addrs/${cryptoData.address}/balance`
        break
    }

    this._http.get(url)
      .subscribe((res: any) => {

          // decode the response based on coin type
          let newBalance = 0
          switch (cryptoData.coinType) {
            case 'bitcoin':
              let satoshi: number = res._body
              newBalance = satoshi / 100000000
              break
            case 'ethereum':
              let resJson: string = res._body
              let resObj = JSON.parse(resJson)
              newBalance = resObj.balance / 1000000000000000000
              break
            case 'litecoin':
              resJson = res._body
              resObj = JSON.parse(resJson)
              newBalance = resObj.balance / 100000000
              break
            case 'bitcoin-cash':
              satoshi = res._body
              newBalance = satoshi / 100000000
              break
            case 'dash':
              resJson = res._body
              resObj = JSON.parse(resJson)
              newBalance = resObj.balance / 100000000
              break
          }

          let oldBallance = cryptoData.balance

          cryptoData.balance = newBalance
          cryptoData.dollarValue = newBalance * this.cryptoList.get(cryptoData.coinType).dollarValue
          cryptoData.lastUpdate = new Date(Date.now())

          if (oldBallance && cryptoData.balance !== oldBallance) {
            // balance changed, warn the user
            let coinName = this.cryptoList.get(cryptoData.coinType).coinName
            this._logService.logInfo(`${coinName} balance changed from ${oldBallance} to ${cryptoData.balance} for account ${cryptoData.accountName}, address ${cryptoData.address}`)
          }

          this.storeCryptoDataList()
        },
        (error) => {
          this._logService.logError('Error getting data for ' +
            cryptoData.coinType + ' <b>account ' + cryptoData.accountName + '</b> address ' + cryptoData.address)// + ': ' + error)
        })

  }


  private updateTicker() {
    this._http.get('https://api.coinmarketcap.com/v1/ticker/?limit=20')
      .subscribe((res: any) => {
          let data = JSON.parse(res._body)
          data.forEach((entry) => {
            if (this.cryptoList.has(entry.id)) {
              this.cryptoList.get(entry.id).dollarValue = entry.price_usd
              this.cryptoList.get(entry.id).coinName = entry.name
            }
          })

          this._localStorageService.storeMap('cryptoList', this.cryptoList)

          //todo update all dollar values
        },
        (error: any) => {
          this._logService.logError('Error getting ticker') // : ' + error)
        })
  }


  private everySecond() {

    // update cryptoList with latest market values
    if (this._tickerTimeout-- <= 0) {
      this._tickerTimeout = this.tickerFrequency

      this.updateTicker()
    }

    // go through list and update next entries according to timeouts
    if (this.cryptoDataList.length > 0) {

      this.cryptoList.forEach((crypto, key) => {

        if (crypto.timeout-- <= 0) {
          // fuzzy this a little bit so than they don't update at the same exact time
          // make it updateFrequency +- 10%
          let tenPercent = this.updateFrequency / 10
          let twentyPercent = this.updateFrequency / 5
          let randomUpToTwentyPercent = twentyPercent * Math.random()
          let fuzzyFrequency = this.updateFrequency - tenPercent + randomUpToTwentyPercent
          crypto.timeout = fuzzyFrequency

          // find next entry
          if (crypto.nextEntry4Update >= this.cryptoDataList.length) {
            crypto.nextEntry4Update = 0
          }
          let initPos = crypto.nextEntry4Update
          let found = false

          do {
            if (this.cryptoDataList[crypto.nextEntry4Update].coinType === crypto.coinType) {
              found = true
            } else {
              if (++crypto.nextEntry4Update >= this.cryptoDataList.length) {
                crypto.nextEntry4Update = 0
              }
            }
          } while (!found && crypto.nextEntry4Update !== initPos)

          if (found) {
            let i = crypto.nextEntry4Update++

            this.getBalance(this.cryptoDataList[i])
          }
        }

      })

    }

    this._timer = setTimeout(() => this.everySecond(), 1000)
  }

}

/*
 doc:
 https://api.coinmarketcap.com/v1/ticker/?limit=20
 [
 {
 "id": "bitcoin",
 "name": "Bitcoin",
 "symbol": "BTC",
 "rank": "1",
 "price_usd": "3596.64",
 "price_btc": "1.0",
 "24h_volume_usd": "4227100000.0",
 "market_cap_usd": "59588275520.0",
 "available_supply": "16567762.0",
 "total_supply": "16567762.0",
 "percent_change_1h": "3.03",
 "percent_change_24h": "3.03",
 "percent_change_7d": "-17.81",
 "last_updated": "1505490271"
 },
 {
 "id": "ethereum",
 "name": "Ethereum",
 "symbol": "ETH",
 "rank": "2",
 "price_usd": "246.717",
 "price_btc": "0.0676884",
 "24h_volume_usd": "1932780000.0",
 "market_cap_usd": "23348261948.0",
 "available_supply": "94635805.0",
 "total_supply": "94635805.0",
 "percent_change_1h": "1.81",
 "percent_change_24h": "2.78",
 "percent_change_7d": "-19.42",
 "last_updated": "1505490269"
 },
 {
 "id": "bitcoin-cash",
 "name": "Bitcoin Cash",
 "symbol": "BCH",
 "rank": "3",
 "price_usd": "416.668",
 "price_btc": "0.114315",
 "24h_volume_usd": "638313000.0",
 "market_cap_usd": "6909574194.0",
 "available_supply": "16582925.0",
 "total_supply": "16582925.0",
 "percent_change_1h": "2.61",
 "percent_change_24h": "-2.08",
 "percent_change_7d": "-31.81",
 "last_updated": "1505490304"
 },
 {
 "id": "ripple",
 "name": "Ripple",
 "symbol": "XRP",
 "rank": "4",
 "price_usd": "0.179407",
 "price_btc": "0.00004922",
 "24h_volume_usd": "286179000.0",
 "market_cap_usd": "6879153641.0",
 "available_supply": "38343841883.0",
 "total_supply": "99994523265.0",
 "percent_change_1h": "2.67",
 "percent_change_24h": "-0.19",
 "percent_change_7d": "-16.59",
 "last_updated": "1505490242"
 },
 {
 "id": "litecoin",
 "name": "Litecoin",
 "symbol": "LTC",
 "rank": "5",
 "price_usd": "47.8067",
 "price_btc": "0.013116",
 "24h_volume_usd": "1479930000.0",
 "market_cap_usd": "2531028080.0",
 "available_supply": "52942957.0",
 "total_supply": "52942957.0",
 "percent_change_1h": "0.37",
 "percent_change_24h": "-2.84",
 "percent_change_7d": "-33.01",
 "last_updated": "1505490243"
 },
 {
 "id": "dash",
 "name": "Dash",
 "symbol": "DASH",
 "rank": "6",
 "price_usd": "275.657",
 "price_btc": "0.075628",
 "24h_volume_usd": "60551400.0",
 "market_cap_usd": "2083721296.0",
 "available_supply": "7559109.0",
 "total_supply": "7559109.0",
 "percent_change_1h": "4.2",
 "percent_change_24h": "4.79",
 "percent_change_7d": "-18.72",
 "last_updated": "1505490257"
 },
 {
 "id": "nem",
 "name": "NEM",
 "symbol": "XEM",
 "rank": "7",
 "price_usd": "0.216337",
 "price_btc": "0.00005935",
 "24h_volume_usd": "14650300.0",
 "market_cap_usd": "1947033000.0",
 "available_supply": "8999999999.0",
 "total_supply": "8999999999.0",
 "percent_change_1h": "4.91",
 "percent_change_24h": "10.55",
 "percent_change_7d": "-21.43",
 "last_updated": "1505490294"
 },
 {
 "id": "monero",
 "name": "Monero",
 "symbol": "XMR",
 "rank": "8",
 "price_usd": "96.6735",
 "price_btc": "0.0265229",
 "24h_volume_usd": "162627000.0",
 "market_cap_usd": "1458436161.0",
 "available_supply": "15086204.0",
 "total_supply": "15086204.0",
 "percent_change_1h": "5.1",
 "percent_change_24h": "-0.76",
 "percent_change_7d": "-20.26",
 "last_updated": "1505490250"
 },
 {
 "id": "iota",
 "name": "IOTA",
 "symbol": "MIOTA",
 "rank": "9",
 "price_usd": "0.477974",
 "price_btc": "0.00013113",
 "24h_volume_usd": "39718400.0",
 "market_cap_usd": "1328543207.0",
 "available_supply": "2779530283.0",
 "total_supply": "2779530283.0",
 "percent_change_1h": "1.79",
 "percent_change_24h": "-1.05",
 "percent_change_7d": "-15.16",
 "last_updated": "1505490295"
 },
 {
 "id": "ethereum-classic",
 "name": "Ethereum Classic",
 "symbol": "ETC",
 "rank": "10",
 "price_usd": "10.0506",
 "price_btc": "0.00275743",
 "24h_volume_usd": "394355000.0",
 "market_cap_usd": "960225942.0",
 "available_supply": "95539166.0",
 "total_supply": "95539166.0",
 "percent_change_1h": "2.99",
 "percent_change_24h": "-11.19",
 "percent_change_7d": "-37.99",
 "last_updated": "1505490272"
 },
 {
 "id": "omisego",
 "name": "OmiseGO",
 "symbol": "OMG",
 "rank": "11",
 "price_usd": "9.7096",
 "price_btc": "0.00266389",
 "24h_volume_usd": "152819000.0",
 "market_cap_usd": "954570428.0",
 "available_supply": "98312024.0",
 "total_supply": "140245398.0",
 "percent_change_1h": "1.91",
 "percent_change_24h": "9.59",
 "percent_change_7d": "-18.41",
 "last_updated": "1505490300"
 },
 {
 "id": "neo",
 "name": "NEO",
 "symbol": "NEO",
 "rank": "12",
 "price_usd": "18.4083",
 "price_btc": "0.00505041",
 "24h_volume_usd": "55568800.0",
 "market_cap_usd": "920415000.0",
 "available_supply": "50000000.0",
 "total_supply": "100000000.0",
 "percent_change_1h": "6.27",
 "percent_change_24h": "10.4",
 "percent_change_7d": "-29.18",
 "last_updated": "1505490275"
 },
 {
 "id": "bitconnect",
 "name": "BitConnect",
 "symbol": "BCC",
 "rank": "13",
 "price_usd": "108.701",
 "price_btc": "0.0298227",
 "24h_volume_usd": "6961680.0",
 "market_cap_usd": "728246549.0",
 "available_supply": "6699539.0",
 "total_supply": "7730471.0",
 "percent_change_1h": "2.66",
 "percent_change_24h": "2.72",
 "percent_change_7d": "-17.53",
 "last_updated": "1505490286"
 },
 {
 "id": "lisk",
 "name": "Lisk",
 "symbol": "LSK",
 "rank": "14",
 "price_usd": "5.45286",
 "price_btc": "0.00149602",
 "24h_volume_usd": "36032900.0",
 "market_cap_usd": "612225855.0",
 "available_supply": "112276100.0",
 "total_supply": "112276100.0",
 "percent_change_1h": "3.54",
 "percent_change_24h": "-1.4",
 "percent_change_7d": "-23.38",
 "last_updated": "1505490268"
 },
 {
 "id": "qtum",
 "name": "Qtum",
 "symbol": "QTUM",
 "rank": "15",
 "price_usd": "8.67916",
 "price_btc": "0.00238118",
 "24h_volume_usd": "239100000.0",
 "market_cap_usd": "512070440.0",
 "available_supply": "59000000.0",
 "total_supply": "100000000.0",
 "percent_change_1h": "2.88",
 "percent_change_24h": "-6.01",
 "percent_change_7d": "-37.26",
 "last_updated": "1505490292"
 },
 {
 "id": "tether",
 "name": "Tether",
 "symbol": "USDT",
 "rank": "16",
 "price_usd": "0.997239",
 "price_btc": "0.0002736",
 "24h_volume_usd": "527102000.0",
 "market_cap_usd": "432284401.0",
 "available_supply": "433481242.0",
 "total_supply": "444951082.0",
 "percent_change_1h": "0.75",
 "percent_change_24h": "-0.71",
 "percent_change_7d": "-1.54",
 "last_updated": "1505490257"
 },
 {
 "id": "stratis",
 "name": "Stratis",
 "symbol": "STRAT",
 "rank": "17",
 "price_usd": "4.36233",
 "price_btc": "0.00119683",
 "24h_volume_usd": "8164030.0",
 "market_cap_usd": "429882160.0",
 "available_supply": "98544163.0",
 "total_supply": "98544163.0",
 "percent_change_1h": "3.7",
 "percent_change_24h": "3.91",
 "percent_change_7d": "-25.85",
 "last_updated": "1505490273"
 },
 {
 "id": "zcash",
 "name": "Zcash",
 "symbol": "ZEC",
 "rank": "18",
 "price_usd": "170.043",
 "price_btc": "0.0466523",
 "24h_volume_usd": "45342000.0",
 "market_cap_usd": "372252822.0",
 "available_supply": "2189169.0",
 "total_supply": "2189169.0",
 "percent_change_1h": "2.13",
 "percent_change_24h": "-1.4",
 "percent_change_7d": "-24.54",
 "last_updated": "1505490277"
 },
 {
 "id": "waves",
 "name": "Waves",
 "symbol": "WAVES",
 "rank": "19",
 "price_usd": "3.67382",
 "price_btc": "0.00100793",
 "24h_volume_usd": "6677720.0",
 "market_cap_usd": "367382000.0",
 "available_supply": "100000000.0",
 "total_supply": "100000000.0",
 "percent_change_1h": "5.11",
 "percent_change_24h": "5.53",
 "percent_change_7d": "-21.33",
 "last_updated": "1505490273"
 },
 {
 "id": "ark",
 "name": "Ark",
 "symbol": "ARK",
 "rank": "20",
 "price_usd": "3.72538",
 "price_btc": "0.00102208",
 "24h_volume_usd": "24490800.0",
 "market_cap_usd": "363505310.0",
 "available_supply": "97575364.0",
 "total_supply": "128825364.0",
 "percent_change_1h": "2.51",
 "percent_change_24h": "-7.35",
 "percent_change_7d": "41.13",
 "last_updated": "1505490286"
 }
 ]


 */
