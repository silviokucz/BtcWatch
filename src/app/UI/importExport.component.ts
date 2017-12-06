import {Component} from "@angular/core";
import {BlockChainService} from "../service/block-chain.service";

@Component(
  {
    selector: 'import-export',
    template: `
      <p-dialog header="Import Export list" [(visible)]="_show"
                (onHide)="close()" modal="modal" width="900" [responsive]="true">
        <br/>
        All information regarding the accounts live only in the local browser storage and is never uploaded to the
        cloud.
        <br/>
        <br/>

        <p-accordion>
          <p-accordionTab header="Export">
            <p-panel>
              <p-header>
                To Export the list, highlight all the text shown and copy to the clipboard and then save it to a file
                using your favorite text editor for example notepad:
              </p-header>
              <textarea style="width: 100%;" [rows]="15" [(ngModel)]="_existingList" pInputTextarea
                        autoResize="autoResize"></textarea>
            </p-panel>
          </p-accordionTab>

          <p-accordionTab header="Import">
            <p-panel>
              <p-header>
                To import the list, paste the text into the box below and press import:
              </p-header>
              <textarea style="width: 100%;" [rows]="5" [(ngModel)]="_newList" pInputTextarea
                        autoResize="autoResize"></textarea>
              <p-footer>
                <button pButton icon="fa-check" iconPos="left" (click)="importList()" label="Import"></button>
              </p-footer>
            </p-panel>
         </p-accordionTab>

        </p-accordion>

      </p-dialog>
    `,
    styles: []
  })
export class ImportExportComponent {
  private _show: boolean

  private _existingList: string
  private _newList: string


  constructor(private _blockChainService: BlockChainService) {
  }

  public show() {
    this._show = true

    this._existingList = this._blockChainService.getList()
  }

  private importList() {
    if (!this._blockChainService.setlist(this._newList)) {
      alert('Import failed')
    }

    this.close()
  }

  private close() {
    this._show = false

    this._existingList = ''
    this._newList = ''
  }
}
