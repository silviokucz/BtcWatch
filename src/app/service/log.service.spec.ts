import {destroyPlatform} from "@angular/core";
import {inject, TestBed} from "@angular/core/testing";
import {LogService} from "./log.service";

describe('LogService', () => {

  beforeEach(() => destroyPlatform());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [LogService]
    })
  })

  it('should create LogService',
    inject([LogService], logService => {
      expect(logService).toBeTruthy()
    }))


  it('should logSuccess',
    inject([LogService], logService => {
      logService.logSuccess('hello world')

      expect(logService.msgs[0].length).toBe(1)
      expect(logService.msgs[0][0].summary).toContain('hello world')
    }))

  it('should logInfo',
    inject([LogService], logService => {
      logService.logInfo('hello world')

      expect(logService.msgs[1].length).toBe(1)
      expect(logService.msgs[1][0].summary).toContain('hello world')
    }))

  it('should logWarn',
    inject([LogService], logService => {
      logService.logWarn('hello world')

      expect(logService.msgs[2].length).toBe(1)
      expect(logService.msgs[2][0].summary).toContain('hello world')
    }))

  it('should logError',
    inject([LogService], logService => {
      logService.logError('hello world')

      expect(logService.msgs[3].length).toBe(1)
      expect(logService.msgs[3][0].summary).toContain('hello world')
    }))

  it('should have only 10 entries',
    inject([LogService], logService => {

      for (let i = 0; i < 12; i++) {
        logService.logSuccess('hello world')
      }

      expect(logService.msgs[0].length).toBe(10)
    }))


})
