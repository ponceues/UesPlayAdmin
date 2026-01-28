import { TestBed } from '@angular/core/testing';

import { MediaGenreService } from './media-genre.service';

describe('MediaGenreService', () => {
  let service: MediaGenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
