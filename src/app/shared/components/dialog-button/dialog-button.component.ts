import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-button',
  imports: [MatButtonModule],
  templateUrl: './dialog-button.component.html',
  styleUrl: './dialog-button.component.scss',
})
export class DialogButtonComponent {
  @Input() variant: 'cancel' | 'save' | 'save-disabled' = 'save';
  @Input() action?: () => void;
  @Input() label = '';
}
