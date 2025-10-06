import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogButtonComponent } from '../../../../../shared/components/dialog-button/dialog-button.component';
import { UserProfileCard } from '../../../models/profile.model';

@Component({
  selector: 'app-user-card-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    DialogButtonComponent,
    MatDialogActions,
  ],
  templateUrl: './user-card-dialog.component.html',
  styleUrl: './user-card-dialog.component.scss',
})
export class UserCardDialogComponent {
  private dialogRef = inject(MatDialogRef<UserCardDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  initialData: UserProfileCard = {
    displayName: this.data?.displayName ?? '',
    englishLevel: this.data?.englishLevel ?? '',
    countryName: this.data?.countryName ?? '',
    cityName: this.data?.cityName ?? '',
  };

  form = new FormGroup({
    displayName: new FormControl(this.data?.displayName, [Validators.required]),
    cityName: new FormControl(this.data?.cityName ?? '', []),
    countryName: new FormControl(this.data?.countryName ?? '', []),
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  changed = computed(() => JSON.stringify(this.formValue()) !== JSON.stringify(this.initialData));

  save = () => {
    if (this.changed() && this.form.valid) {
      const result: UserProfileCard = {
        displayName: this.form.value.displayName ?? '',
        englishLevel: this.data?.englishLevel ?? '',
        cityName: this.form.value.cityName ?? '',
        countryName: this.form.value.countryName ?? '',
      };
      this.dialogRef.close(result);
    }
  };

  cancel = () => this.dialogRef.close();
}
