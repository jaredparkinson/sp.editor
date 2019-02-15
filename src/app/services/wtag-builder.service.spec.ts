import { TestBed } from '@angular/core/testing';

import { WTagService } from './wtag-builder.service';

describe('WTagBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WTagService = TestBed.get(WTagService);
    expect(service).toBeTruthy();
  });
});
