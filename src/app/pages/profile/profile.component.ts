import { Component } from '@angular/core';
import { LanguagesCardComponent } from './cards/languages-card/languages-card.component';

@Component({
  selector: 'app-profile',
  imports: [LanguagesCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
