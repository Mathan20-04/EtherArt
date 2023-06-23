import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectablesComponent } from './collectables.component';

describe('CollectablesComponent', () => {
  let component: CollectablesComponent;
  let fixture: ComponentFixture<CollectablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
