import { LanguageNamePipe } from '../../pipes/language-name-pipe';

describe('LanguageNamePipe', () => {
  it('create an instance', () => {
    const pipe = new LanguageNamePipe();
    expect(pipe).toBeTruthy();
  });
});
