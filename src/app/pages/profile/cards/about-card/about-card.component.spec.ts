import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAboutView } from '../../store/profile.selectors';
import { AboutCardComponent } from './about-card.component';

describe('AboutCardComponent', () => {
  let component: AboutCardComponent;
  let fixture: ComponentFixture<AboutCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCardComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectAboutView, '');
    store.refreshState();

    fixture = TestBed.createComponent(AboutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
