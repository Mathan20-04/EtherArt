import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletitemComponent } from './walletitem.component';

describe('WalletitemComponent', () => {
  let component: WalletitemComponent;
  let fixture: ComponentFixture<WalletitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
