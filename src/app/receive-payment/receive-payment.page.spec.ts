import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceivePaymentPage } from './receive-payment.page';

describe('ReceivePaymentPage', () => {
  let component: ReceivePaymentPage;
  let fixture: ComponentFixture<ReceivePaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
