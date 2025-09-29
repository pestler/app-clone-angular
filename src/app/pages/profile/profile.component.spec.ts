import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GITHUB_USERNAME_KEY } from '../../token';
import { ProfileComponent } from './profile.component';
import {
  selectAboutView,
  selectContactsView,
  selectLanguagesView,
  selectLoading,
  selectUserView,
} from './store/profile.selectors';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideMockStore(), { provide: GITHUB_USERNAME_KEY, useValue: '' }],
    }).compileComponents();

    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectContactsView, {});
    store.overrideSelector(selectUserView, {});
    store.overrideSelector(selectAboutView, '');
    store.overrideSelector(selectLanguagesView, []);
    store.refreshState();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
