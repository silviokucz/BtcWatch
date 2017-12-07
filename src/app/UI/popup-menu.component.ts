import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {MenuItem} from "primeng/primeng";


@Component({
  selector: 'popup-menu',
  template: `
    <p-menu #menu popup="popup" [model]="items"></p-menu>
    <button type="button" pButton icon="fa fa-list" (click)="menu.toggle($event)"></button>
  `,
  styles: []
})

export class PopupMenuComponent implements OnInit {

  items: MenuItem[]

  @Output() onAbout = new EventEmitter<boolean>()
  @Output() onImportExport = new EventEmitter<boolean>()


  ngOnInit() {


    this.items = [
      {
        label: 'Import/Export List', icon: 'fa-clipboard', command: (event) => {
        this.onImportExport.emit(true)

      }
      },
      {
        label: 'About', icon: 'fa-copyright', command: (event) => {
        this.onAbout.emit(true)

      }
      }

    ]
  }

}
