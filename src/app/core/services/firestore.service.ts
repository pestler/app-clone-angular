import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private readonly firestore = inject(Firestore);

  async getCollection<T>(
    collectionName: string,
    converter: FirestoreDataConverter<T>,
  ): Promise<T[]> {
    const colRef = collection(this.firestore, collectionName).withConverter(converter);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => d.data());
  }

  async getDoc<T>(
    collectionName: string,
    docId: string,
    converter: FirestoreDataConverter<T>,
  ): Promise<T | undefined> {
    const docRef = doc(this.firestore, collectionName, docId).withConverter(converter);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : undefined;
  }

  async findDoc<T>(
    collectionName: string,
    field: string,
    value: unknown,
    converter: FirestoreDataConverter<T>,
  ): Promise<T | undefined> {
    const colRef = collection(this.firestore, collectionName).withConverter(converter);
    const q = query(colRef, where(field, '==', value), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return undefined;
    }
    return snapshot.docs[0].data();
  }
}
