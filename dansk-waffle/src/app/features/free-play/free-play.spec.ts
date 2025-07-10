import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreePlay } from './free-play';

describe('FreePlay', () => {
  let component: FreePlay;
  let fixture: ComponentFixture<FreePlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreePlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreePlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
