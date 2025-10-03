import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageName',
})
export class LanguageNamePipe implements PipeTransform {
  transform(code: string, locale = 'en'): string {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
    return displayNames.of(code.toLowerCase()) ?? code;
  }
}
