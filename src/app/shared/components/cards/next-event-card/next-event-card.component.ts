import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Event } from '../../../../core/models/dashboard.models';

@Component({
  selector: 'app-next-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule],
  templateUrl: './next-event-card.component.html',
  styleUrls: ['./next-event-card.component.scss'],
})
export class NextEventCardComponent {
  @Input() nextEvents: Event[] = [];
  @Input() courseAlias = '';

  displayedColumns: string[] = ['topic', 'date', 'time'];
}
