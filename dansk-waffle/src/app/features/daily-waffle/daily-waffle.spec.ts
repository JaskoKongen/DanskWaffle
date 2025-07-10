import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWaffle } from './daily-waffle';

describe('DailyWaffle', () => {
  let component: DailyWaffle;
  let fixture: ComponentFixture<DailyWaffle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyWaffle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyWaffle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
