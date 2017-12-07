import {TestBed, async} from '@angular/core/testing';
import {MenuModule} from "primeng/primeng";
import {destroyPlatform} from "@angular/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {PopupMenuComponent} from "./popup-menu.component";


describe('PopupMenuComponent', () => {
  beforeEach(() => destroyPlatform());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MenuModule],
      declarations: [
        PopupMenuComponent
      ]
    }).compileComponents();
  }));

  it('should create the PopupMenuComponent', async(() => {

    const fixture = TestBed.createComponent(PopupMenuComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should list 2 items', async(() => {

    var fixture = TestBed.createComponent(PopupMenuComponent);

    fixture.whenStable().then(() => {
      // after something in the component changes, you should detect changes
      fixture.detectChanges();

      var lis = fixture.debugElement.queryAll((a) => {
        return a.name === 'li'
      });

      expect(lis.length).toBe(2)

    })
  }));

  it('should have Import/Export List', async(() => {

    var fixture = TestBed.createComponent(PopupMenuComponent);

    fixture.whenStable().then(() => {
      // after something in the component changes, you should detect changes
      fixture.detectChanges();

      const app = fixture.debugElement.componentInstance;
      app.ngOnInit()

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('ul > li:nth-child(1) > a > span.ui-menuitem-text').innerText)
        .toContain('Import/Export List');
    })
  }));

  it('should have About', async(() => {

    var fixture = TestBed.createComponent(PopupMenuComponent);

    fixture.whenStable().then(() => {
      // after something in the component changes, you should detect changes
      fixture.detectChanges();

      const app = fixture.debugElement.componentInstance;
      app.ngOnInit()

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('ul > li:nth-child(2) > a > span.ui-menuitem-text').innerText)
        .toContain('About');
    })
  }));


});
