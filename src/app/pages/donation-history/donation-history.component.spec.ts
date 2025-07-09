import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { DonationHistoryComponent } from './donation-history.component';

describe('DonationHistoryComponent', () => {
  let component: DonationHistoryComponent;
  let fixture: ComponentFixture<DonationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationHistoryComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
