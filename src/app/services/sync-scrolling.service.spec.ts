import { TestBed, inject } from '@angular/core/testing';

import { SyncScrollingService } from './sync-scrolling.service';

describe('SyncScrollingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SyncScrollingService]
    });
  });

  it('should be created', inject([SyncScrollingService], (service: SyncScrollingService) => {
    expect(service).toBeTruthy();
  }));
});
