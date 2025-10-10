import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectContactsView } from '../../store/profile.selectors';
import { ContactsCardComponent } from './contacts-card.component';

describe('ContactsCardComponent', () => {
  let component: ContactsCardComponent;
  let fixture: ComponentFixture<ContactsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsCardComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectContactsView, {});
    store.refreshState();

    fixture = TestBed.createComponent(ContactsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
