import {TestBed, async} from '@angular/core/testing';
import {CarouselModule, PanelModule} from "primeng/primeng";
import {destroyPlatform} from "@angular/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {BlockChainService} from "../service/block-chain.service";
import {TickerComponent} from "./ticker.component";
import{Crypto} from "../model/crypto.model"

class MockBlockChainService {

  public cryptoList: Map<string, Crypto>

  constructor() {
    this.cryptoList = new Map()
    this.cryptoList.set('bitcoin', new Crypto('bitcoin', 'Bitcoin'))
    this.cryptoList.set('ethereum', new Crypto('ethereum', 'Ethereum'))
    this.cryptoList.set('litecoin', new Crypto('litecoin', 'LiteCoin'))
  }
}


describe('TickerComponent', () => {
  beforeEach(() => destroyPlatform());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PanelModule,
        CarouselModule],
      declarations: [
        TickerComponent
      ],
      providers: [
        {provide: BlockChainService, useClass: MockBlockChainService}
      ]
    }).compileComponents();
  }));

  it('should create the TickerComponent', async(() => {

    const fixture = TestBed.createComponent(TickerComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should list 3 items', async(() => {

    var fixture = TestBed.createComponent(TickerComponent);

    fixture.whenStable().then(() => {
      // after something in the component changes, you should detect changes
      fixture.detectChanges();

      var lis = fixture.debugElement.queryAll((a) => {
        return a.name === 'li'
      });

      expect(lis.length).toBe(3)

    })
  }));


});
