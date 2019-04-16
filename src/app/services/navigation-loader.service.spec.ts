import { TestBed } from '@angular/core/testing';

import { NavigationLoaderService } from './navigation-loader.service';

describe('NavigationLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationLoaderService = TestBed.get(NavigationLoaderService);
    expect(service).toBeTruthy();
  });
});
