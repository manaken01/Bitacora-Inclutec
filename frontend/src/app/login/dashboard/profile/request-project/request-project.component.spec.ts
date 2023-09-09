import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestProjectComponent } from './request-project.component';

describe('RequestProjectComponent', () => {
  let component: RequestProjectComponent;
  let fixture: ComponentFixture<RequestProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
