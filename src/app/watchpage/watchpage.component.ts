import {Component, ViewChild} from "@angular/core";
import {ImportExportComponent} from "../UI/importExport.component";
import {AboutComponent} from "../UI/about.component";

@Component({
  selector: 'app-watchpage',
  template: `

    <import-export></import-export>

    <popup-menu (onAbout)="onAbout()" (onImportExport)="onImportExport()"></popup-menu>
    <br>

    <about></about>
    
    <br>

    <crypto-watch></crypto-watch>

    <br>

    <p>
      <ticker></ticker>
    </p>

    <log-view></log-view>
  `,
  styles: []
})
export class WatchpageComponent {

  @ViewChild(ImportExportComponent) importExportComponent: ImportExportComponent;
  @ViewChild(AboutComponent) aboutComponent: AboutComponent;

  private onAbout() {
    this.aboutComponent.show()
  }

  private onImportExport() {
    this.importExportComponent.show()
  }

}
