import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesDialogComponent } from './languages-dialog.component';

describe('LanguagesDialogComponent', () => {
  let component: LanguagesDialogComponent;
  let fixture: ComponentFixture<LanguagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
