import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDuty } from './assign-duty';

describe('AssignDuty', () => {
  let component: AssignDuty;
  let fixture: ComponentFixture<AssignDuty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDuty],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignDuty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
