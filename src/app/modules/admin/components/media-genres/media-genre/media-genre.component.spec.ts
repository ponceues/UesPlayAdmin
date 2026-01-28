import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaGenreComponent } from './media-genre.component';

describe('MediaGenreComponent', () => {
  let component: MediaGenreComponent;
  let fixture: ComponentFixture<MediaGenreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaGenreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
