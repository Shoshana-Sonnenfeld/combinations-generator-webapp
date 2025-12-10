import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { CombinationsApiService } from '../../core/services/api/combinations-api.service';
import { ClientStateService } from '../../core/services/state/client-state.service';

import { NextPermutation } from '../../core/models/domain/next-permutation.model';

import { PaginationControlsComponent } from '../pagination-controls/pagination-controls.component';
import { CombinationsListComponent } from '../combination-list/combinations-list.component';
import { AllCombinationsPageResponse } from '../../core/models/dto/AllCombinationsPageRsponse.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-combinations-page',
  standalone: true,
  templateUrl: './all-combinations-page.component.html',
  styleUrls: ['./all-combinations-page.component.scss'],
  imports: [
    CommonModule,
    PaginationControlsComponent,
    CombinationsListComponent
  ]
})
export class AllCombinationsPageComponent implements OnInit {

  combinations: AllCombinationsPageResponse | null = null;
  errorMessage: string | null = null;

  lastCombination: NextPermutation | null = null;

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;

  constructor(
    @Inject(CombinationsApiService) private combinationsApi: CombinationsApiService,
    @Inject(ClientStateService) private clientState: ClientStateService,
    private router: Router
  ) { }



  // ✅ טעינה אוטומטית של עמוד ראשון
  ngOnInit(): void {
    this.fetchCombinations(1);

    // ✅ מאזין לשינויים בקומבינציה הנוכחית
    this.clientState.currentCombination$.subscribe(combination => {
      console.log('Current combination updated:', combination);
    });

    this.totalPages= Math.ceil(this.combinations?.totalCount! / this.pageSize);
  }

  

  // ✅ קריאה לשרת עם שליפה נכונה של sessionId
  async fetchCombinations(page: number): Promise<void> {
    this.errorMessage = null;

    const sessionId = await firstValueFrom(this.clientState.sessionId$);

    console.log('fetchCombinations sessionId:', sessionId);

    if (!sessionId) {
      this.errorMessage = 'Session ID is missing. Please start a new session.';
      return;
    }

    this.combinationsApi.getAllCombinations(sessionId, this.pageSize, page).subscribe({

      next: (response: AllCombinationsPageResponse) => {
        console.log('All combinations response:', response);

        this.combinations = response;
        this.currentPage = page;
        this.totalPages = Math.ceil(response.totalCount / this.pageSize);
      },

      error: (err: HttpErrorResponse) => {
        console.error('getAllCombinations error:', err);
        this.errorMessage = err.error?.error || 'An error occurred while loading combinations.';
      }
    });
  }

  nextPage(): void {
    if (this.combinations?.hasNext) {
      this.fetchCombinations(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.combinations?.hasPrevious) {
      this.fetchCombinations(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchCombinations(page);
    } else {
      console.warn(`Invalid page number: ${page}`);
    }
  }

  async backToSingle(): Promise<void> {
    this.errorMessage = null;

    const sessionId = await firstValueFrom(this.clientState.sessionId$);

    if (!sessionId || !this.combinations) {
      this.errorMessage = 'Session data is missing.';
      return;
    }

    // מיפוי הקומבינציה האחרונה למודל NextPermutation
    const lastCombination = this.combinations.permutations[this.combinations.permutations.length - 1];
    const mappedCombination: NextPermutation = {
      values: lastCombination.permutation,
      index: lastCombination.globalIndex,
      hasMore: this.combinations.hasNext
    };

    this.clientState.setCurrentCombination(mappedCombination);

    const pageNumber = this.currentPage;
    const pageSize = this.pageSize;
    const itemsCount = this.combinations.permutations.length;

    this.combinationsApi.exitPaging(sessionId, pageNumber, pageSize, itemsCount)
      .subscribe({
        next: () => {
          // חזרה למסך Single
          this.clientState.setCurrentScreen('single');
          this.router.navigate(['/single-combination']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('exit-paging error:', err);
          this.errorMessage = err.error?.error || 'Exit paging failed.';
        }
      });
  }
  }
