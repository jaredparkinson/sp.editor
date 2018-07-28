import { inject, TestBed } from '@angular/core/testing';

import { CssClassGenService } from './cssclassconverter.service';

describe('CssclassconverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CssClassGenService]
    });
  });

  it('should be created', inject(
    [CssClassGenService],
    (service: CssClassGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
