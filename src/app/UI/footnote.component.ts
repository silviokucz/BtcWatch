import {Component} from "@angular/core";

@Component(
  {
    selector: 'footnote',
    templateUrl: './footnote.component.html',
    styles: [`
      #inner {
        display: table;
        margin: 0 auto;
      }
      #inner th, td {
        border-bottom: 1px solid #ddd;
      }
    `]
  })
export class FootnoteComponent {
}
