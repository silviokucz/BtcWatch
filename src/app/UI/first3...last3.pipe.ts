import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'first3EllpsisLast3Pipe'})
export class first3EllpsisLast3Pipe implements PipeTransform {

  transform(value: string): string {

    let res: string
    let length = value.length

    if (length <= 9) {
      return value
    }

    res = value.substring(0, 3)
    res += ' . . . '
    res += value.substring(length - 3, length)

    return res;
  }
}
