import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberComponent } from './subscriber.component';

describe('SubscriberComponent', () => {
  let component: SubscriberComponent;
  let fixture: ComponentFixture<SubscriberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
