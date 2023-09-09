import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCollaboratorsComponent } from './modal-collaborators.component';

describe('ModalCollaboratorsComponent', () => {
  let component: ModalCollaboratorsComponent;
  let fixture: ComponentFixture<ModalCollaboratorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCollaboratorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
