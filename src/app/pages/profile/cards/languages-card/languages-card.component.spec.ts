import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectLanguagesView } from '../../store/profile.selectors';
import { LanguagesCardComponent } from './languages-card.component';

describe('LanguagesCardComponent', () => {
  let component: LanguagesCardComponent;
  let fixture: ComponentFixture<LanguagesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagesCardComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectLanguagesView, []);
    store.refreshState();

    fixture = TestBed.createComponent(LanguagesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
