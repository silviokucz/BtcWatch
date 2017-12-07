import { TestBed, async } from '@angular/core/testing';
import {AboutComponent} from "./about.component";
import {DialogModule} from "primeng/primeng";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


describe('AboutComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogModule, NoopAnimationsModule],
      declarations: [
        AboutComponent
      ],
    }).compileComponents();
  }));

  it('should create the AboutComponent', async(() => {
    const fixture = TestBed.createComponent(AboutComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));



  it('should show', async(() => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    fixture.componentInstance.show();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.ui-dialog-titlebar').innerText).toContain('About');
  }));


});
