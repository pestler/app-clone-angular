import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { studentMockInfo } from '../../../../core/mocks/student.mock';

@Component({
  selector: 'app-user-card',
  imports: [MatIconModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  user = studentMockInfo;
  openDialog() {
    console.log('h');
  }
}
