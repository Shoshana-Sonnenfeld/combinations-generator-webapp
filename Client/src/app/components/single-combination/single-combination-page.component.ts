import { Component, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CombinationsApiService } from '../../core/services/api/combinations-api.service';
import { ClientStateService } from '../../core/services/state/client-state.service';
import { NextPermutation } from '../../core/models/domain/next-permutation.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CombinationViewComponent } from '../combination-view/combination-view.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-single-combination-page',
  standalone: true,
  templateUrl: './single-combination-page.component.html',
  styleUrls: ['./single-combination-page.component.scss'],
  imports: [CommonModule, CombinationViewComponent, ErrorMessageComponent],
})
export class SingleCombinationPageComponent implements OnDestroy {

  currentCombination: NextPermutation | null = null;
  errorMessage: string | null = null;
  totalPermutations: number | null = null;

  private subscriptions = new Subscription();

  constructor(
    @Inject(CombinationsApiService) private combinationsApi: CombinationsApiService,
    @Inject(ClientStateService) private clientState: ClientStateService,
    private router: Router
  ) {

    // ✅ מאזין למספר הקומבינציות הכולל
    this.subscriptions.add(
      this.clientState.totalPermutations$.subscribe(
        total => this.totalPermutations = total
      )
    );

    // ✅ מאזין לקומבינציה הנוכחית מה־state
    this.subscriptions.add(
      this.clientState.currentCombination$.subscribe(
        comb => this.currentCombination = comb
      )
    );
  }

async getNextCombination(): Promise<void> {
  this.errorMessage = null;

  const sessionId = await firstValueFrom(this.clientState.sessionId$);
  console.log('sessionId from state:', sessionId);

  if (!sessionId) {
    this.errorMessage = 'Session ID is missing. Please start a new session.';
    return;
  }

  this.combinationsApi.getNextPermutation(sessionId).subscribe({
    next: (response: any) => {
      console.log('RAW response from server:', response);

      if (response && response.permutation) {
        const fixedResponse = {
          values: response.permutation,
          index: response.index,
          hasMore: response.hasMore
        };

        this.clientState.setCurrentCombination(fixedResponse);
        this.clientState.setCurrentIndex(response.index);
      } else {
        this.errorMessage = 'Invalid combination data received from server.';
      }
    },
    error: (err) => {
      console.error('HTTP error:', err);
      this.errorMessage = err.error?.error || 'An error occurred while fetching next combination.';
    }
  });
}


  resetSession(): void {
    firstValueFrom(this.clientState.sessionId$).then((sessionId) => {
      if (!sessionId) {
        console.error('Session ID is missing. Cannot delete state.');
        this.clientState.resetState();
        this.router.navigate(['/']);
        return;
      }

      this.combinationsApi.deleteState(sessionId).subscribe({
        next: () => {
          console.log('Session state deleted successfully on the server.');
          this.clientState.resetState();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to delete session state on the server:', err);
          // עדיין נאפס את הסטייט המקומי גם אם קריאת השרת נכשלה
          this.clientState.resetState();
          this.router.navigate(['/']);
        },
      });
    });
  }

  switchToAllCombinations(): void {
    this.clientState.setCurrentScreen('all');
    this.router.navigate(['/all-combinations']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
