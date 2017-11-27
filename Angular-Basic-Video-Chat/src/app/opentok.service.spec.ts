import { TestBed, inject } from '@angular/core/testing';
import * as OT from '@opentok/client';

import { OpentokService } from './opentok.service';


describe('OpentokService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpentokService]
    });
  });

  describe('service', () => {
    let service;
    beforeEach(inject([OpentokService], (s: OpentokService) => {
      service = s;
    }));

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('getOT() should return OT', () => {
      expect(service.getOT()).toEqual(OT);
    });

    describe('connectSession()', () => {
      const OT = {
        initSession() {}
      };
      let session;

      beforeEach(() => {
        spyOn(service, 'getOT').and.returnValue(OT);
        session = jasmine.createSpyObj('session', ['connect', 'on']);
        spyOn(OT, 'initSession').and.returnValue(session);
      });

      it('should call OT.initSession and connect', () => {
        service.connectSession();
        expect(OT.initSession).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
        expect(service.session).toEqual(session);
      });
    });
  });
});
