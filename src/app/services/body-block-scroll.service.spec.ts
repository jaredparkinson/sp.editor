import { TestBed } from '@angular/core/testing';

import { BodyScrollService } from './body-block-scroll.service';

describe('BodyBlockScrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodyScrollService = TestBed.get(BodyScrollService);
    expect(service).toBeTruthy();
  });
});
