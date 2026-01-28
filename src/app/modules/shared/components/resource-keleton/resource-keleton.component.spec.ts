import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceKeletonComponent } from './resource-keleton.component';

describe('ResourceKeletonComponent', () => {
  let component: ResourceKeletonComponent;
  let fixture: ComponentFixture<ResourceKeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceKeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceKeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
