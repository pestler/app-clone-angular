import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRole {
  private _activeRole$ = new BehaviorSubject<string | null>(null);
  readonly activeRole$ = this._activeRole$.asObservable();

  setActiveRole(role: string): void {
    this._activeRole$.next(role);
  }

  getActiveRole(): string | null {
    return this._activeRole$.getValue();
  }
}
