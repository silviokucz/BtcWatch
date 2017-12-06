import {destroyPlatform} from "@angular/core";
import {inject, TestBed} from "@angular/core/testing";
import {LocalStorageService} from "./localStorage.service";

describe('LocalStorageService', () => {

  beforeEach(() => destroyPlatform());

  beforeEach(() => {

    var store = {}

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key]
    })
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + ''
    })
    spyOn(localStorage, 'clear').and.callFake(function () {
      store = {}
    })


    TestBed.configureTestingModule({
      imports: [],
      providers: [LocalStorageService]
    });
  });


  it('should create LocalStorageService',
    inject([LocalStorageService], localStorageService => {
      expect(localStorageService).toBeTruthy()
    }))


  it('should storeObject',
    inject([LocalStorageService], localStorageService => {
      let testKey = 'testKey'
      let testObj = {say: 'hello world'}

      localStorageService.storeObject(testKey, testObj)
      let storedObj = JSON.parse(localStorage.getItem(testKey))
      expect(storedObj.say).toBe('hello world')
    }))

  it('should retrieveObject',
    inject([LocalStorageService], localStorageService => {
      let testKey = 'testKey'
      let testObj = {say: 'hello world'}

      localStorage.setItem(testKey, JSON.stringify(testObj))
      let storedObj = localStorageService.retrieveObject(testKey)
      expect(storedObj.say).toBe('hello world')
    }))

  it('should filter Out __',
    inject([LocalStorageService], localStorageService => {
      let testKey = 'testKey'
      let testObj = {say: 'hello world', __dontSay: 'goodbye world'}
      expect(Object.keys(testObj).length).toBe(2)

      localStorageService.storeObject(testKey, testObj)
      let storedObj = localStorageService.retrieveObject(testKey)
      expect(Object.keys(storedObj).length).toBe(1)
    }))

  it('should storeMap and retrieveMap',
    inject([LocalStorageService], localStorageService => {
      let testKey = 'testKey'
      let testMap : Map<string, any>
      testMap = new Map()
      testMap.set('test1',{say: 'hello world'})
      testMap.set('test2', {say: 'hello world', __dontSay: 'goodbye world'})

      localStorageService.storeMap(testKey, testMap)
      let storeMap = localStorageService.retrieveMap(testKey)
      expect(storeMap.get('test1').say).toBe('hello world')
    }))

})
