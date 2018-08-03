import { TestBed, inject } from '@angular/core/testing';

import { AppManagerService } from './app-manager.service';

describe('AppManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppManagerService]
    });
  });

  it('should be created', inject([AppManagerService], (service: AppManagerService) => {
    expect(service).toBeTruthy();
  }));
});
