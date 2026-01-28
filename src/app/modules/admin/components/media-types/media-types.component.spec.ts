import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTypesComponent } from './media-types.component';

describe('MediaTypesComponent', () => {
  let component: MediaTypesComponent;
  let fixture: ComponentFixture<MediaTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
