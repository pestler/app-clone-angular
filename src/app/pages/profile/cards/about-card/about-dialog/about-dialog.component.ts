import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogButtonComponent } from '../../../../../shared/components/dialog-button/dialog-button.component';

@Component({
  selector: 'app-about-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    DialogButtonComponent,
  ],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.scss',
})
export class AboutDialogComponent {
  private dialogRef = inject(MatDialogRef<AboutDialogComponent>);
  private data = inject<{ about: string }>(MAT_DIALOG_DATA);

  about = this.data.about || '';

  save = () => this.dialogRef.close(this.about);

  cancel = () => this.dialogRef.close();
}
