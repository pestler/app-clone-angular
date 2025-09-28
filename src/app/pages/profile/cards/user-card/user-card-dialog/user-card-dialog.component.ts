import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogButtonComponent } from '../../../../../shared/components/dialog-button/dialog-button.component';
import { UserProfileCardModal } from '../../../models/profile.model';

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

  initialData: UserProfileCardModal = {
    nameCtrl: this.data?.name ?? '',
    locationCtrl: this.data?.location ?? '',
  };

  form = new FormGroup({
    nameCtrl: new FormControl(this.data?.name, [Validators.required]),
    locationCtrl: new FormControl(this.data?.location),
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  changed = computed(() => JSON.stringify(this.formValue()) !== JSON.stringify(this.initialData));

  save = () => {
    if (this.changed() && this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  };

  cancel = () => this.dialogRef.close();
}
