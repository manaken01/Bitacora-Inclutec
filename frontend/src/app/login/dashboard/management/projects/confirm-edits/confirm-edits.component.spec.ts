import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEditsComponent } from './confirm-edits.component';

describe('ConfirmEditsComponent', () => {
  let component: ConfirmEditsComponent;
  let fixture: ComponentFixture<ConfirmEditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmEditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
