import { TestBed } from '@angular/core/testing';

import { EditService } from "./EditService";

describe('EditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditService = TestBed.get(EditService);
    expect(service).toBeTruthy();
  });
});
