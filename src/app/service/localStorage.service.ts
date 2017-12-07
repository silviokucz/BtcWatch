import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorageService {

  public storeObject(key: string, object: any) {
    // object items that have the name starting with __ will not be stored
    localStorage.setItem(key, JSON.stringify(object, this.filterOut__))
  }

  public retrieveObject(key: string): any {
    let v = localStorage.getItem(key)
    return JSON.parse(v)
  }

  private filterOut__(key: string, value: any) {
    if (key.startsWith('__')) {
      return undefined
    } else {
      return value
    }
  }

  public storeMap(key: string, map: any) {
    localStorage.setItem(key, JSON.stringify(this.mapToJson(map)))
  }

  public retrieveMap(key: string): any {
    let v = localStorage.getItem(key)
    if(v === null) {
      return null
    }
    return this.jsonToMap(v)
  }

  private mapToJson(map) {
    let a = Array.from(map)
    let b = JSON.stringify(a)
    return b
}

  private jsonToMap(jsonStr) {
    let a = JSON.parse(jsonStr)
    let b = JSON.parse(a)
    let c = new Map(b)
    return c
}


}
