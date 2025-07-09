import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { ReceiveHistoryComponent } from './receive-history.component';

describe('ReceiveHistoryComponent', () => {
  let component: ReceiveHistoryComponent;
  let fixture: ComponentFixture<ReceiveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveHistoryComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
