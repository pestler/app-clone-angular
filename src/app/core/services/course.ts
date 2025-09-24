import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable, shareReplay } from 'rxjs';
import { Course, courseConverter } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly firestore: Firestore = inject(Firestore);

  private courses$: Observable<Course[]> | null = null;

  getCourses(): Observable<Course[]> {
    if (!this.courses$) {
      console.log('[CourseService] Fetching courses from Firestore...');
      const coursesCollection = collection(this.firestore, 'courses').withConverter(
        courseConverter,
      );

      this.courses$ = (collectionData(coursesCollection) as Observable<Course[]>).pipe(
        shareReplay(1),
      );
    }

    return this.courses$;
  }
}
