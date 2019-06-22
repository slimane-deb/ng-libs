import { TestBed } from '@angular/core/testing';

import { DynamicListingService } from './dynamic-listing.service';

describe('DynamicListingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicListingService = TestBed.get(DynamicListingService);
    expect(service).toBeTruthy();
  });
});
