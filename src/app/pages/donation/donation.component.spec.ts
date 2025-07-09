import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { DonationComponent } from './donation.component';

describe('DonationComponent', () => {
  let component: DonationComponent;
  let fixture: ComponentFixture<DonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
