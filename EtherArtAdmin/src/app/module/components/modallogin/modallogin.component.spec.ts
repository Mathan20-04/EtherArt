import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalloginComponent } from './modallogin.component';

describe('ModalloginComponent', () => {
  let component: ModalloginComponent;
  let fixture: ComponentFixture<ModalloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
