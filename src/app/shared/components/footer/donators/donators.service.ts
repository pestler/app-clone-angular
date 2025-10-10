import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Donator } from './donator.model';

@Injectable({
  providedIn: 'root',
})
export class DonatorsService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly donatorsCollection = collection(this.firestore, 'donators');

  getDonators(): Observable<Donator[]> {
    return collectionData(this.donatorsCollection, { idField: 'id' }) as Observable<Donator[]>;
  }
}
