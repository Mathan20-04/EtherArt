import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcollectionComponent } from './listcollection.component';

describe('ListcollectionComponent', () => {
  let component: ListcollectionComponent;
  let fixture: ComponentFixture<ListcollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListcollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
