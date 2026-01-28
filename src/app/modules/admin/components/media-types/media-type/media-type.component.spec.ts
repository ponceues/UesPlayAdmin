import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTypeComponent } from './media-type.component';

describe('MediaTypeComponent', () => {
  let component: MediaTypeComponent;
  let fixture: ComponentFixture<MediaTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
