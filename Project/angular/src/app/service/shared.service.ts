import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  resetPassword$ = new BehaviorSubject<string>('');

  userEmailSource = new BehaviorSubject<string>('');

  constructor() {}

  emitEvent(val: string) {
    this.userEmailSource.next(val);
  }

  resetPassword(val: string) {
    this.resetPassword$.next(val);
  }
}
