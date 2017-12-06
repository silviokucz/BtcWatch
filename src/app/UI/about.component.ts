import {Component} from "@angular/core";

@Component(
  {
    selector: 'about',
    templateUrl: './about.component.html',
    styles: []
  })
export class AboutComponent {
  private _show: boolean

  public show() {
    this._show = true
  }

  private close() {
  }
}
