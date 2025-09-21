import { Component } from '@angular/core';
import { AboutCardComponent } from './cards/about-card/about-card.component';
import { ContactsCardComponent } from './cards/contacts-card/contacts-card.component';
import { LanguagesCardComponent } from './cards/languages-card/languages-card.component';
import { UserCardComponent } from './cards/user-card/user-card.component';

@Component({
  selector: 'app-profile',
  imports: [LanguagesCardComponent, AboutCardComponent, UserCardComponent, ContactsCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
