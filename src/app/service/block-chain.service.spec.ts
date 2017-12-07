import {fakeAsync, TestBed, inject, tick, async, discardPeriodicTasks, flushMicrotasks} from '@angular/core/testing';
import {BlockChainService} from './block-chain.service';
import {HttpModule, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {LocalStorageService} from "./localStorage.service";
import {LogService} from "./log.service";
import {Crypto} from "../model/crypto.model";
import {destroyPlatform} from "@angular/core";
import Jasmine = jasmine.Jasmine;


class mockLocalStorageService {

  public retrieveMap(key: string): any {

    let cryptoList = new Map()
    cryptoList.set('bitcoin', new Crypto('bitcoin', 'Bitcoin'))
    cryptoList.set('ethereum', new Crypto('ethereum', 'Ethereum'))
    cryptoList.set('litecoin', new Crypto('litecoin', 'LiteCoin'))

    return cryptoList
  }

  public storeMap(key: string, map: any) {
  }

  public retrieveObject(key: string): any {
    let v = [
      {
        address: "address18",
        accountName: "accountName1",
        coinType: "bitcoin",
        balance: 2.99881198,
        dollarValue: 16582.080784009002,
        lastUpdate: "2017-10-15T17:50:20.780Z"
      }
    ]
    return v
  }

  public storeObject(key: string, object: any) {
  }

}

class mockLogService {
  public logError(message: string) {
    console.log(message)
  }

  public logInfo(message: string) {
    console.log(message)
  }
}

const mockResponse =
  `[
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "rank": "1",
      "price_usd": "6001.99",
      "price_btc": "1.0",
      "24h_volume_usd": "2010100000.0",
      "market_cap_usd": "99871234977.0",
      "available_supply": "16639687.0",
      "total_supply": "16639687.0",
      "percent_change_1h": "0.34",
      "percent_change_24h": "-0.99",
      "percent_change_7d": "8.08",
      "last_updated": "1508695750"
    },
    {
      "id": "ethereum",
      "name": "Ethereum",
      "symbol": "ETH",
      "rank": "2",
      "price_usd": "294.506",
      "price_btc": "0.0492308",
      "24h_volume_usd": "330080000.0",
      "market_cap_usd": "28053788376.0",
      "available_supply": "95257103.0",
      "total_supply": "95257103.0",
      "percent_change_1h": "-0.3",
      "percent_change_24h": "-0.86",
      "percent_change_7d": "-10.85",
      "last_updated": "1508695752"
    }
]`


describe('BlockChainService', () => {
  let mockHttp: Http
  let httpSpy: any

  beforeEach(() => destroyPlatform());

  beforeEach(() => {
    mockHttp = {get: null} as Http;

    // httpSpy = spyOn(mockHttp, 'get').and.returnValue(Observable.of({
    //   _body: 10000
    // }));
    httpSpy = spyOn(mockHttp, 'get').and.callFake((url: string) => {
      console.log('mockHttp ' + url)
      if (url.indexOf('addressbalance') != -1) {
        return Observable.of({
          _body: 20000
        })
      } else {
        return Observable.of({
          _body: mockResponse
        })
      }

    })


    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Http,
          useValue: mockHttp
        },
        BlockChainService,
        {
          provide: LocalStorageService,
          useClass: mockLocalStorageService
        },
        {
          provide: LogService,
          useClass: mockLogService
        }
      ]
    });
  });


  it('should create BlockChainService',
    inject([BlockChainService], blockChainService => {
      expect(blockChainService).toBeTruthy()
    }));

  it('should have 5 items in cryptoList',
    inject([BlockChainService], blockChainService => {
      expect(blockChainService.cryptoList.size).toBe(5)
    }));

  it('should have 1 bitcoin address in cryptoDataList',
    inject([BlockChainService], blockChainService => {
      expect(blockChainService.cryptoDataList.length).toBe(1)
      expect(blockChainService.cryptoDataList[0].coinType).toBe('bitcoin')
    }));

  it('should export the list',
    inject([BlockChainService], blockChainService => {
      let exported = blockChainService.getList()
      expect(exported).toContain('"coinType":"bitcoin"')
    }));

  it('should import the list',
    inject([BlockChainService], blockChainService => {

      let list = `[{"address":"address18","accountName":"accountName1","coinType":"bitcoin",
      "balance":2.99881198,"dollarValue":16582.080784009002,"lastUpdate":"2017-10-15T17:50:20.780Z"},
      {"address":"address19","accountName":"accountName2","coinType":"ethereum",
      "balance":20,"dollarValue":6000,"lastUpdate":"2017-10-10T17:50:20.780Z"}]`

      let res = blockChainService.setlist(list)
      expect(res).toBe(true)

      expect(blockChainService.cryptoDataList.length).toBe(2)
      expect(blockChainService.cryptoDataList[1].address).toBe('address19')
    }));

  it('should remove the list',
    inject([BlockChainService], blockChainService => {

      let list = `[{"address":"address18","accountName":"accountName1","coinType":"bitcoin",
      "balance":2.99881198,"dollarValue":16582.080784009002,"lastUpdate":"2017-10-15T17:50:20.780Z"},
      {"address":"address19","accountName":"accountName2","coinType":"ethereum",
      "balance":20,"dollarValue":6000,"lastUpdate":"2017-10-10T17:50:20.780Z"}]`

      let res = blockChainService.setlist(list)
      expect(res).toBe(true)

      expect(blockChainService.cryptoDataList.length).toBe(2)

      let removable = {
        address: "address18",
        accountName: "accountName1",
        coinType: "bitcoin",
        balance: 2.99881198,
        dollarValue: 16582.080784009002,
        lastUpdate: "2017-10-15T17:50:20.780Z"
      }
      blockChainService.removeFromCryptoDataList(removable)
      expect(blockChainService.cryptoDataList.length).toBe(1)
    }));

  it('should add to the list',
    inject([BlockChainService], blockChainService => {
      expect(blockChainService.cryptoDataList.length).toBe(1)

      blockChainService.addToCryptoDataList("address19", "accountName2", "ethereum")
      expect(blockChainService.cryptoDataList.length).toBe(2)
      expect(blockChainService.cryptoDataList[1].address).toBe('address19')
    }));


  it('should store the list',
    inject([BlockChainService], blockChainService => {
      let v = spyOn(blockChainService._localStorageService, 'storeObject')

      blockChainService.storeCryptoDataList()
      expect(v).toHaveBeenCalled()
      expect(v).toHaveBeenCalledWith('btcAddressList', [Object(
        {
          address: 'address18',
          accountName: 'accountName1',
          coinType: 'bitcoin',
          balance: 2.99881198,
          dollarValue: 16582.080784009002,
          lastUpdate: '2017-10-15T17:50:20.780Z'
        })
      ])

    }));


  it('should get balance',
    fakeAsync(
      inject([BlockChainService], blockChainService => {

        clearTimeout(blockChainService._timer)

        blockChainService.getBalance(blockChainService.cryptoDataList[0])

        expect(httpSpy).toHaveBeenCalledTimes(1)

        tick()

        expect(blockChainService.cryptoDataList[0].balance).toBe(0.0002)


      })
    )
  )

  it('should get the ticker',
    fakeAsync(
      inject([BlockChainService], blockChainService => {

        clearTimeout(blockChainService._timer)

        expect(blockChainService.cryptoList.get('bitcoin').dollarValue).toBe(0)

        blockChainService.updateTicker()

        expect(httpSpy).toHaveBeenCalledTimes(1)

        tick()

        expect(blockChainService.cryptoList.get('bitcoin').dollarValue).toBe('6001.99')

      })
    )
  )

});
