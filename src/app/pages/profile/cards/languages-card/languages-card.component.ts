import { Component } from '@angular/core';
import { EmptyStateType } from '../../models/empty-state.enum';
import { BaseCardComponent } from '../base-card/base-card.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-languages-card',
  imports: [BaseCardComponent, EmptyStateComponent],
  templateUrl: './languages-card.component.html',
  styleUrl: './languages-card.component.scss',
})
export class LanguagesCardComponent {
  lanquages: string[] = [];
  EmptyStateType = EmptyStateType;
}
