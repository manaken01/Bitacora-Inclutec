import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTaskComponent } from './info-task.component';

describe('InfoTaskComponent', () => {
  let component: InfoTaskComponent;
  let fixture: ComponentFixture<InfoTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
