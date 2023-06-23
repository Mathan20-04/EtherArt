import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListforsaleComponent } from './listforsale.component';

describe('ListforsaleComponent', () => {
  let component: ListforsaleComponent;
  let fixture: ComponentFixture<ListforsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListforsaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListforsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
