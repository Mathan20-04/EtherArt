import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListvariantComponent } from './listvariant.component';

describe('ListvariantComponent', () => {
  let component: ListvariantComponent;
  let fixture: ComponentFixture<ListvariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListvariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListvariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
