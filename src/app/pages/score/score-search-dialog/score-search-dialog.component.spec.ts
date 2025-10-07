import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSearchDialogComponent } from './score-search-dialog.component';

describe('ScoreSearchDialogComponent', () => {
  let component: ScoreSearchDialogComponent;
  let fixture: ComponentFixture<ScoreSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreSearchDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
