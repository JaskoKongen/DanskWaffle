import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaffleGrid } from './waffle-grid';

describe('WaffleGrid', () => {
  let component: WaffleGrid;
  let fixture: ComponentFixture<WaffleGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaffleGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaffleGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
