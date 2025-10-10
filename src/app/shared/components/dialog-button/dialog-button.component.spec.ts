import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogButtonComponent } from './dialog-button.component';

describe('DialogButtonComponent', () => {
  let component: DialogButtonComponent;
  let fixture: ComponentFixture<DialogButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
