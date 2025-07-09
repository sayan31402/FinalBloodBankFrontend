import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DonationService } from './donation.service';

describe('DonationService', () => {
  let service: DonationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DonationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
