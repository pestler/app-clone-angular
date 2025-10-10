import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DialogButtonComponent } from '../../../../../shared/components/dialog-button/dialog-button.component';
import { LanguageNamePipe } from '../../../../../shared/pipes/language-name-pipe';
import { LANGUAGES_ISO } from '../../../models/languages.model';

@Component({
  selector: 'app-languages-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    MatIconModule,
    LanguageNamePipe,
    DialogButtonComponent,
  ],
  templateUrl: './languages-dialog.component.html',
  styleUrl: './languages-dialog.component.scss',
})
export class LanguagesDialogComponent {
  private dialogRef = inject(MatDialogRef<LanguagesDialogComponent>);
  private data = inject<{ languages: string[] }>(MAT_DIALOG_DATA);

  languages = this.data.languages ? [...this.data.languages] : [];
  allLanguages = LANGUAGES_ISO;

  remove(lang: string) {
    this.languages = this.languages.filter((l) => l !== lang);
  }

  save = () => this.dialogRef.close(this.languages);

  cancel = () => this.dialogRef.close();
}
