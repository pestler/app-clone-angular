import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component'; // Убедитесь, что путь к компоненту верный

import { ActivatedRoute } from '@angular/router';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavComponent],

      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
