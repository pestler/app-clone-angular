import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './repository-card.component.html',
  styleUrls: ['./repository-card.component.scss'],
})
export class RepositoryCardComponent {
  @Input() url?: string;
  @Output() sendInvite = new EventEmitter<void>();

  get repoName(): string {
    return this.url ? (this.url.split('/').pop() ?? '') : '';
  }

  onSendInvite(): void {
    this.sendInvite.emit();
    alert('Invite logic not implemented yet.');
  }
}
