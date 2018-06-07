import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { OpentokService } from './opentok.service';

describe('AppComponent', () => {
  let fixture;
  let session;
  let app;
  let opentokService;
  const OT = {
    initSession() {},
    initPublisher() {}
  };

  beforeEach(async(() => {
    session = jasmine.createSpyObj('session', ['connect', 'on', 'subscribe', 'isConnected']);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PublisherComponent,
        SubscriberComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    opentokService = fixture.debugElement.injector.get(OpentokService);
    spyOn(opentokService, 'getOT').and.returnValue(OT);
    opentokService.session = session;
    spyOn(opentokService, 'initSession').and.returnValue(Promise.resolve(session));
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));
  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
  it(`should have as title 'app'`, () => {
    expect(app.title).toEqual('Angular Basic Video Chat');
  });
  it('should render title in a h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Angular Basic Video Chat');
  });
  it('should have called initSession on the opentokService', () => {
    expect(app.session).toBe(session);
    expect(opentokService.initSession).toHaveBeenCalled();
  });
  it('should populate the streams when we get a streamCreated', () => {
    expect(app.streams).toEqual([]);
    expect(session.on).toHaveBeenCalledWith('streamCreated', jasmine.any(Function));
    expect(session.on).toHaveBeenCalledWith('streamDestroyed', jasmine.any(Function));
    const stream = {};
    const event = {
      stream
    };
    session.on.calls.argsFor(0)[1](event); // Call streamCreated handler
    expect(app.streams).toEqual([stream]);
    session.on.calls.argsFor(1)[1](event); // Call streamDestroyed handler
    expect(app.streams).toEqual([]);
  });
});
