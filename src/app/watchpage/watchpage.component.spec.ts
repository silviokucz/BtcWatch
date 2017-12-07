import {async, inject, TestBed} from '@angular/core/testing';

import { WatchpageComponent } from './watchpage.component';
import {PopupMenuComponent} from "../UI/popup-menu.component";
import {AboutComponent} from "../UI/about.component";
import {DialogModule, MenuModule,} from "primeng/primeng";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


  describe('WatchpageComponent', () => {
    let fixture;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          MenuModule,
          DialogModule,
          NoopAnimationsModule
        ],
        declarations: [WatchpageComponent, PopupMenuComponent, AboutComponent],
        providers: []
      });

      fixture = TestBed.overrideComponent(WatchpageComponent, {
        set: {
          template: '<popup-menu (onAbout)="onAbout()" (onImportExport)="onImportExport()"></popup-menu><about></about>'
        }})
        .createComponent(WatchpageComponent);

      fixture.detectChanges();
    });


    it('should create the WatchpageComponent', async(() => {
       const component = fixture.debugElement.componentInstance;
       expect(component).toBeTruthy();

     }));

    it('should pop About page', async(inject([], () => {
      fixture.componentInstance.onAbout();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('div.ui-dialog-titlebar').innerText).toContain('About');
      });
    })));


  });
