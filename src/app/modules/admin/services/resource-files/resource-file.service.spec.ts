import { TestBed } from '@angular/core/testing';

import { ResourceFileService } from './resource-file.service';

describe('ResourceFileService', () => {
  let service: ResourceFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
