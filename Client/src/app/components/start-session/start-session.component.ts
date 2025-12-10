import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CombinationsApiService } from '../../core/services/api/combinations-api.service';
import { ClientStateService } from '../../core/services/state/client-state.service';
import { StartResponse } from '../../core/models/dto/start-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-session',
  standalone: true,
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss'],
  imports: [FormsModule, CommonModule], // Adding FormsModule for ngModel support
})
export class StartSessionComponent {
  n: number | null = null;
  errorMessage: string | null = null;
  totalPermutations: number | null = null;
  currentCombination: string | null = null;
  combinationIndex: number = 0;

  constructor(
    @Inject(CombinationsApiService) private combinationsApi: CombinationsApiService,
    @Inject(ClientStateService) private clientState: ClientStateService,
    private router: Router
  ) {}

  reset(): void {
    this.totalPermutations = null;
    this.currentCombination = null;
    this.combinationIndex = 0;
    this.clientState.resetState();
  }

  startSession(): void {
    if (this.n === null || this.n < 1 || this.n > 20) {
      this.errorMessage = 'Please enter a number between 1 and 20.';
      return;
    }

    console.log('Sending request to start session with n:', this.n);
    this.combinationsApi.startSession(this.n).subscribe({
      next: (response: StartResponse) => {
        console.log('Server response:', response);
        this.clientState.setSessionId(response.sessionId);
        this.clientState.setN(this.n!);
        this.clientState.setTotalPermutations(response.totalPermutations);
        this.clientState.setCurrentIndex(response.currentIndex);

        // Navigate to the SessionDetailsComponent after session creation
        this.router.navigate(['/single-combination']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error response from server:', err);
        this.errorMessage = err.error?.error || 'An error occurred.';
      },
    });
  }
}
