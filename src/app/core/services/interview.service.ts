import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  collectionGroup,
  doc,
  Firestore,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ScoreData } from '../models/dashboard.models';
import { InterviewInfo } from '../models/interview.model';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private readonly firestore: Firestore = inject(Firestore);

  getInterviews(courseAlias: string, studentId: string): Observable<InterviewInfo[]> {
    const interviewsCollection = collection(
      this.firestore,
      `courses/${courseAlias}/students/${studentId}/interview`,
    );
    const q = query(interviewsCollection);
    return collectionData(q, { idField: 'id' }) as Observable<InterviewInfo[]>;
  }

  getMentorInterviews(courseAlias: string, mentorId: string): Observable<InterviewInfo[]> {
    const interviewsCollectionGroup = collectionGroup(this.firestore, 'interview');
    const q = query(
      interviewsCollectionGroup,
      where('mentorId', '==', mentorId),
      where('courseAlias', '==', courseAlias),
    );
    return collectionData(q, { idField: 'id' }) as Observable<InterviewInfo[]>;
  }

  getStudentsWithoutInterview(courseAlias: string): Observable<ScoreData[]> {
    const studentsCollection = collection(this.firestore, `courses/${courseAlias}/students`);
    return collectionData(studentsCollection) as Observable<ScoreData[]>;
  }

  async createInterview(
    courseAlias: string,
    studentId: string,
    mentorId: string,
    interviewData: Partial<InterviewInfo>,
  ): Promise<void> {
    const interviewsCollection = collection(
      this.firestore,
      `courses/${courseAlias}/students/${studentId}/interview`,
    );

    const tempDocRef = doc(interviewsCollection);
    const autoId = tempDocRef.id;

    const customId = `${mentorId}-${autoId.substring(0, 5)}`;
    const interviewDocRef = doc(
      this.firestore,
      `courses/${courseAlias}/students/${studentId}/interview/${customId}`,
    );

    const newInterviewData = {
      ...interviewData,
      studentId: studentId,
      mentorId: mentorId,
      courseAlias: courseAlias,
      active: true,
    };
    await setDoc(interviewDocRef, newInterviewData);

    const studentScoreDocRef = doc(this.firestore, `courses/${courseAlias}/students/${studentId}`);
    await updateDoc(studentScoreDocRef, { hasInterview: true });
  }

  async updateInterview(
    courseAlias: string,
    studentId: string,
    interviewId: string,
    data: Partial<InterviewInfo>,
  ): Promise<void> {
    const interviewDocRef = doc(
      this.firestore,
      `courses/${courseAlias}/students/${studentId}/interview/${interviewId}`,
    );
    await updateDoc(interviewDocRef, data);
  }
}
