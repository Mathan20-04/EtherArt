import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedCollectionsComponent } from './generated-collections.component';

describe('GeneratedCollectionsComponent', () => {
  let component: GeneratedCollectionsComponent;
  let fixture: ComponentFixture<GeneratedCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
