import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpartComponent } from './listpart.component';

describe('ListpartComponent', () => {
  let component: ListpartComponent;
  let fixture: ComponentFixture<ListpartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListpartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
