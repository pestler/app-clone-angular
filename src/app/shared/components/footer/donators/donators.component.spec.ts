import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DonatorsComponent } from './donators.component';
import { DonatorsService } from './donators.service';

describe('DonatorsComponent', () => {
  let component: DonatorsComponent;
  let fixture: ComponentFixture<DonatorsComponent>;

  beforeEach(async () => {
    const donatorsServiceSpy = jasmine.createSpyObj('DonatorsService', ['getDonators']);
    donatorsServiceSpy.getDonators.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DonatorsComponent],
      providers: [{ provide: DonatorsService, useValue: donatorsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DonatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
