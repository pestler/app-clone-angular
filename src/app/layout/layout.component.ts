import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { take } from 'rxjs';
import { CourseService } from '../core/services/course';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class Layout implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  ngOnInit(): void {
    const hasCourseParam = this.route.snapshot.queryParamMap.has('course');

    if (!hasCourseParam) {
      this.courseService
        .getCourses()
        .pipe(take(1))
        .subscribe((courses) => {
          if (courses && courses.length > 0) {
            const firstCourseAlias = courses[0].alias;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { course: firstCourseAlias },
              queryParamsHandling: 'merge',
            });
          }
        });
    }
  }

  isFooterVisible() {
    return this.router.url === '/';
  }
}
