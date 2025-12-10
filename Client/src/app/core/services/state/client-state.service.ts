import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NextPermutation } from '../../models/domain/next-permutation.model';

@Injectable({
  providedIn: 'root',
})
export class ClientStateService {
  private sessionIdSubject = new BehaviorSubject<string | null>(null);
  private currentCombinationSubject = new BehaviorSubject<NextPermutation | null>(null);
  private currentScreenSubject = new BehaviorSubject<'start' | 'single' | 'all'>('start');
  private nSubject = new BehaviorSubject<number | null>(null);
  private totalPermutationsSubject = new BehaviorSubject<number | null>(null);
  private currentIndexSubject = new BehaviorSubject<number | null>(null);

  sessionId$ = this.sessionIdSubject.asObservable();
  currentCombination$ = this.currentCombinationSubject.asObservable();
  currentScreen$ = this.currentScreenSubject.asObservable();
  n$ = this.nSubject.asObservable();
  totalPermutations$ = this.totalPermutationsSubject.asObservable();
  currentIndex$ = this.currentIndexSubject.asObservable();

  setSessionId(sessionId: string): void {
    this.sessionIdSubject.next(sessionId);
  }

  setCurrentCombination(combination: NextPermutation): void {
    this.currentCombinationSubject.next(combination);
  }

  setCurrentScreen(screen: 'start' | 'single' | 'all'): void {
    this.currentScreenSubject.next(screen);
  }

  setN(n: number): void {
    this.nSubject.next(n);
  }

  setTotalPermutations(totalPermutations: number): void {
    this.totalPermutationsSubject.next(totalPermutations);
  }

  setCurrentIndex(currentIndex: number): void {
    this.currentIndexSubject.next(currentIndex);
  }

  resetState(): void {
    this.sessionIdSubject.next(null);
    this.currentCombinationSubject.next(null);
    this.currentScreenSubject.next('start');
    this.nSubject.next(null);
    this.totalPermutationsSubject.next(null);
    this.currentIndexSubject.next(null);
  }
}
