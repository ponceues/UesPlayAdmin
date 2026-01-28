import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiyAccountComponent } from './verify-account.component';

describe('VerfiyAccountComponent', () => {
  let component: VerfiyAccountComponent;
  let fixture: ComponentFixture<VerfiyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfiyAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerfiyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
