import {Component} from "@angular/core";
import {LogService} from "../service/log.service";


@Component({
  selector: 'log-view',
  template: `

    <div *ngFor="let msg of _logService.msgs; let i=index">
      <p-messages [(value)]="_logService.msgs[i]"></p-messages>
    </div>

  `,
  styles: []
})

export class LogViewComponent {

  constructor(private _logService: LogService) {
  }

}
