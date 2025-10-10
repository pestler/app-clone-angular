import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogButtonComponent } from '../../../../dialog-button/dialog-button.component';

@Component({
  selector: 'app-rate-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    DialogButtonComponent,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './rate-dialog.component.html',
  styleUrl: './rate-dialog.component.scss',
})
export class RateDialogComponent {
  rating: number | null = null;
  private dialogRef = inject(MatDialogRef<RateDialogComponent>);

  get isValid() {
    return this.rating !== null && this.rating >= 1 && this.rating <= 10;
  }

  get isInvalidRating(): boolean {
    return this.rating !== null && (isNaN(this.rating) || this.rating < 0 || this.rating > 10);
  }

  cancel = () => this.dialogRef.close();
  save = () => this.dialogRef.close(this.rating);
}
