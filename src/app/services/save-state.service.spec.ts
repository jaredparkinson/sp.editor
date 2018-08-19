import { inject, TestBed } from '@angular/core/testing';

import { SaveStateService } from './save-state.service';

describe('SaveStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveStateService]
    });
  });

  it('should be created', inject(
    [SaveStateService],
    (service: SaveStateService) => {
      expect(service).toBeTruthy();
    }
  ));
});
