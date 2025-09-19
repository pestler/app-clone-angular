import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Course, courseConverter } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly firestore: Firestore = inject(Firestore);

  getCourses(): Observable<Course[]> {
    const coursesCollection = collection(this.firestore, 'courses').withConverter(courseConverter);
    return collectionData(coursesCollection);
  }
}
