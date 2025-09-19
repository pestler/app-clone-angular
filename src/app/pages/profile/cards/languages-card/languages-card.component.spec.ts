import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesCardComponent } from './languages-card.component';

describe('LanguagesCardComponent', () => {
  let component: LanguagesCardComponent;
  let fixture: ComponentFixture<LanguagesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagesCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
