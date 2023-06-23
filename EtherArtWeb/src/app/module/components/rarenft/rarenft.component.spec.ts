import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RarenftComponent } from './rarenft.component';

describe('RarenftComponent', () => {
  let component: RarenftComponent;
  let fixture: ComponentFixture<RarenftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RarenftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RarenftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
