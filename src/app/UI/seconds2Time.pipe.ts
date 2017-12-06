import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'seconds2Time'})
export class seconds2TimePipe implements PipeTransform {

  transform(value: number): string {
    let minutes = Math.floor(value / 60)
    let seconds = Math.floor(value % 60)

    let res = ''
    if (minutes) {
      res += `${minutes}m `
    }
    if (seconds) {
      res += `${seconds}s`
    }

    return res;
  }
}
