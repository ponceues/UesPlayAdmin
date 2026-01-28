import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesSkeletonComponent } from './resources-skeleton.component';

describe('ResourcesSkeletonComponent', () => {
  let component: ResourcesSkeletonComponent;
  let fixture: ComponentFixture<ResourcesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
