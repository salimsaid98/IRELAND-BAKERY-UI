import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerViewPage } from './customer-view.page';

describe('CustomerViewPage', () => {
  let component: CustomerViewPage;
  let fixture: ComponentFixture<CustomerViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
