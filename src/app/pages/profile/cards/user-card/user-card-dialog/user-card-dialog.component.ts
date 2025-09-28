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
    countryName: this.data?.countryName ?? '',
    cityName: this.data?.cityName ?? '',
  };

  form = new FormGroup({
    displayName: new FormControl(this.data?.displayName, [Validators.required]),
    location: new FormControl(this.combineLocation(this.data?.cityName, this.data?.countryName)),
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  changed = computed(
    () =>
      JSON.stringify(this.formValue()) !==
      JSON.stringify({
        displayName: this.initialData.displayName,
        location: this.combineLocation(this.initialData.cityName, this.initialData.countryName),
      }),
  );

  private combineLocation(city?: string, country?: string): string {
    if (city && country) return `${city}, ${country}`;
    return city || country || '';
  }

  private splitLocation(location: string): { cityName: string; countryName: string } {
    const [city = '', country = ''] = (location ?? '').split(',').map((s) => s.trim());
    return { cityName: city, countryName: country };
  }

  save = () => {
    if (this.changed() && this.form.valid) {
      const { cityName, countryName } = this.splitLocation(this.form.value.location ?? '');
      const result: UserProfileCard = {
        displayName: this.form.value.displayName ?? '',
        cityName,
        countryName,
      };
      this.dialogRef.close(result);
    }
  };

  cancel = () => this.dialogRef.close();
}
