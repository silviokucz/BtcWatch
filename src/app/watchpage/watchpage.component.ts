import {Component, ViewChild} from "@angular/core";
import {ImportExportComponent} from "../UI/importExport.component";
import {AboutComponent} from "../UI/about.component";

@Component({
  selector: 'app-watchpage',
  template: `

    <import-export></import-export>

    <popup-menu (onAbout)="onAbout()" (onImportExport)="onImportExport()"></popup-menu>

    <about></about>

    <p>
      <ticker></ticker>
    </p>

    <br>

    <crypto-watch></crypto-watch>

    <br>

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
