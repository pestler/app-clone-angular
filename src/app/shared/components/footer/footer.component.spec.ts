import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DonatorsService } from './donators/donators.service';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    const donatorsServiceSpy = jasmine.createSpyObj('DonatorsService', ['getDonators']);
    donatorsServiceSpy.getDonators.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: DonatorsService, useValue: donatorsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
