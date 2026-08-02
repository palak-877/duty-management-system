import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningStatus } from './joining-status';

describe('JoiningStatus', () => {
  let component: JoiningStatus;
  let fixture: ComponentFixture<JoiningStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoiningStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(JoiningStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
