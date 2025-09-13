import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { courseSelectOptions, CourseSelectProps } from './course-selet.data';

@Component({
  selector: 'app-course-select',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, NgClass],
  templateUrl: './course-select.component.html',
  styleUrl: './course-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSelectComponent {
  cources: CourseSelectProps[] = courseSelectOptions;
  selectedCourse = this.cources.find((cource) => !cource.isArchived);
}
