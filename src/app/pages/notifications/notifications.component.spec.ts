import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationsDataService } from '../../core/services/notifications-data.service';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let mockNotificationsDataService: jasmine.SpyObj<NotificationsDataService>;

  beforeEach(async () => {
    mockNotificationsDataService = jasmine.createSpyObj('NotificationsDataService', [
      'unsubscribe',
    ]);

    Object.defineProperty(mockNotificationsDataService, 'notifications$', {
      value: of([]),
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [{ provide: NotificationsDataService, useValue: mockNotificationsDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
