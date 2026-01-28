import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistSkeletonComponent } from './picklist-skeleton.component';

describe('PicklistSkeletonComponent', () => {
  let component: PicklistSkeletonComponent;
  let fixture: ComponentFixture<PicklistSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicklistSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicklistSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
