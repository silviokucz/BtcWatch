import { TestBed, async } from '@angular/core/testing';
import {Message, MessagesModule} from "primeng/primeng";
import {LogViewComponent} from "./logView.component";
import {destroyPlatform} from "@angular/core";
import {LogService} from "../service/log.service";


class MockLogService {

  public msgs: Message[][] = [[{severity: 'success', summary: 'summary',detail:`detail`},{severity: 'success', summary: 'summary',detail:`detail`}],
    [{severity: 'success', summary: 'summary',detail:`detail`},{severity: 'success', summary: 'summary',detail:`detail`}]]

}


describe('LogViewComponent', () => {
  beforeEach(() => destroyPlatform());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MessagesModule],
      declarations: [
        LogViewComponent
      ],
      providers: [
        { provide: LogService, useClass: MockLogService }
      ]
    }).compileComponents();
  }));

  it('should create the LogViewComponent', async(() => {

    const fixture = TestBed.createComponent(LogViewComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should list 4 items', async(() => {

    var fixture = TestBed.createComponent(LogViewComponent);

    fixture.whenStable().then(() => {
      // after something in the component changes, you should detect changes
      fixture.detectChanges();

      var lis = fixture.debugElement.queryAll((a)=>{
        return a.name === 'li'
      });

      expect(lis.length).toBe(4)

    })



  }));



});
