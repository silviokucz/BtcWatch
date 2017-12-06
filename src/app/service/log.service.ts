import {Injectable} from "@angular/core";
import {Message} from "primeng/primeng";


@Injectable()
export class LogService {

  public msgs: Message[][] = [[], [], [], [], []]

  public logSuccess(message: string) {
    let maxRows = 10

    this.msgs[0].push({severity: 'success', summary: '- ' + message,detail:`-- ${new Date(Date.now()).toLocaleString()} `})

    if (this.msgs[0].length >= maxRows) {
      this.msgs[0].splice(0, this.msgs[0].length - maxRows)
    }
  }

  public logInfo(message: string) {
    let maxRows = 10

    this.msgs[1].push({severity: 'info', summary: '- ' + message,detail:`-- ${new Date(Date.now()).toLocaleString()} `})

    if (this.msgs[1].length >= maxRows) {
      this.msgs[1].splice(0, this.msgs[1].length - maxRows)
    }
  }

  public logWarn(message: string) {
    let maxRows = 10

    this.msgs[2].push({severity: 'warn', summary: '- ' + message,detail:`-- ${new Date(Date.now()).toLocaleString()} `})

    if (this.msgs[2].length >= maxRows) {
      this.msgs[2].splice(0, this.msgs[2].length - maxRows)
    }
  }

  public logError(message: string) {
    let maxRows = 10

    this.msgs[3].push({severity: 'error', summary: '- ' + message,detail:`-- ${new Date(Date.now()).toLocaleString()} `})

    if (this.msgs[3].length >= maxRows) {
      this.msgs[3].splice(0, this.msgs[3].length - maxRows)
    }
  }

}
