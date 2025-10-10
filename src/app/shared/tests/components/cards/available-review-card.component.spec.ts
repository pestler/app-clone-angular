// import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AvailableReviewCardComponent } from '../../../components/cards/available-review-card/available-review-card.component';

describe('AvailableReviewCardComponent', () => {
  let component: AvailableReviewCardComponent;
  let fixture: ComponentFixture<AvailableReviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, AvailableReviewCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableReviewCardComponent);
    component = fixture.componentInstance;
  });

  it('shows empty state when no reviews', () => {
    component.availableReviews = [];
    fixture.detectChanges();

    const messageP = fixture.debugElement.query(By.css('mat-card-content p'));
    expect(messageP.nativeElement.textContent.trim()).toBe(
      'At the moment, there are no tasks available for review',
    );
  });

  it('renders list with names and labels', async () => {
    component.courseAlias = 'angular';
    component.availableReviews = [
      { id: '1', name: 'Task 1', checksCount: 4, completedChecksCount: 1 },
      { id: '2', name: 'Task 2', checksCount: 2, completedChecksCount: 2 },
    ];
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.review-item'));
    expect(items.length).toBe(2);

    const links = items.map(
      (item) => item.query(By.css('.review-link')).nativeElement as HTMLAnchorElement,
    );

    expect(links[0].textContent?.trim()).toBe('Task 1');
    expect(links[1].textContent?.trim()).toBe('Task 2');

    const labels = items.map((item) =>
      item.query(By.css('.progress-label')).nativeElement.textContent.trim(),
    );

    expect(labels[0]).toBe('1 / 4');
    expect(labels[1]).toBe('2 / 2');

    const href = links[0].getAttribute('href') ?? '';
    expect(href).toContain('/cross-check-review');
    expect(href).toContain('course=angular');
    expect(href).toContain('taskId=1');
  });
});
