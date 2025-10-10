import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-base-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './base-card.component.html',
  styleUrl: './base-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseCardComponent {
  @Input({ required: true }) isEdit!: boolean;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) icon = '';

  @Output() editClick = new EventEmitter<void>();

  onEditClick() {
    this.editClick.emit();
  }
}
