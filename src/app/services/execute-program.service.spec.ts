import { TestBed } from '@angular/core/testing';

import { ExecuteProgramService } from './execute-program.service';

describe('ExecuteProgramService', () => {
  let service: ExecuteProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecuteProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
