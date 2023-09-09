import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeNotificationComponent } from './large-notification.component';

describe('LargeNotificationComponent', () => {
  let component: LargeNotificationComponent;
  let fixture: ComponentFixture<LargeNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
