import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface SearchDialogData {
  field: 'githubId' | 'name' | 'city';
  value: string;
}

@Component({
  selector: 'app-score-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './score-search-dialog.component.html',
  styleUrl: './score-search-dialog.component.scss',
})
export class ScoreSearchDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ScoreSearchDialogComponent>);
  public readonly data: SearchDialogData = inject(MAT_DIALOG_DATA);

  searchControl: FormControl<string | null>;
  title: string;

  constructor() {
    this.searchControl = new FormControl(this.data.value || '');
    const fieldName = this.data.field === 'githubId' ? 'Github' : this.data.field;
    this.title = `Filter by ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
  }

  onApply(): void {
    this.dialogRef.close({
      field: this.data.field,
      value: this.searchControl.value,
    });
  }

  onReset(): void {
    this.searchControl.reset('');
    this.dialogRef.close({
      field: this.data.field,
      value: this.searchControl.value,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
