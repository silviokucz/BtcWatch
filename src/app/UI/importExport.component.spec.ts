import { TestBed, async } from '@angular/core/testing';
import {AccordionModule, DialogModule, MessagesModule, PanelModule} from "primeng/primeng";
import {destroyPlatform} from "@angular/core";
import {BlockChainService} from "../service/block-chain.service";
import {ImportExportComponent} from "./importExport.component";
import {FormsModule} from "@angular/forms";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


class MockBlockChainService {

  public getList(){

    return 'hello world'
  }

  public setlist(newList) {

  }
}


describe('ImportExportComponent', () => {
  beforeEach(() => destroyPlatform());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogModule, AccordionModule, FormsModule, PanelModule, NoopAnimationsModule],
      declarations: [
        ImportExportComponent
      ],
      providers: [
        { provide: BlockChainService, useClass: MockBlockChainService }
      ]
    }).compileComponents();
  }));

  it('should create the ImportExportComponent', async(() => {

    const fixture = TestBed.createComponent(ImportExportComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have current list', async(() => {

    var fixture = TestBed.createComponent(ImportExportComponent);

    fixture.whenStable().then(() => {
      // after something in the component changes, you should detect changes
      fixture.detectChanges();

      const app = fixture.debugElement.componentInstance;
      app.show()

      fixture.detectChanges();

      expect(app._existingList).toBe('hello world')

    })



  }));



});
