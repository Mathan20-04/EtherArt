import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortpartComponent } from './sortpart.component';

describe('SortpartComponent', () => {
  let component: SortpartComponent;
  let fixture: ComponentFixture<SortpartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortpartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortpartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
