import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StartResponse } from '../../models/dto/start-response.model';
import { NextPermutation } from '../../models/domain/next-permutation.model';

import { AllCombinationsPageResponse } from '../../models/dto/AllCombinationsPageRsponse.model';

@Injectable({
  providedIn: 'root',
})
export class CombinationsApiService {
  private readonly baseUrl = 'https://localhost:7186/api/combinations';

  constructor(private http: HttpClient) { }

  startSession(n: number): Observable<StartResponse> {
    return this.http.post<StartResponse>(`${this.baseUrl}/start`, n);
  }

  getNextPermutation(sessionId: string): Observable<NextPermutation> {
    return this.http.get<NextPermutation>(`${this.baseUrl}/next`, {
      params: { sessionId },
    });
  }

  getAllCombinations(
    sessionId: string,
    pageSize: number,
    pageNumber: number
  ): Observable<AllCombinationsPageResponse> {
    return this.http.get<AllCombinationsPageResponse>(`${this.baseUrl}/all`, {
      params: { sessionId, pageSize: pageSize.toString(), pageNumber: pageNumber.toString() },
    });
  }


  exitPaging(
    sessionId: string,
    pageNumber: number,
    pageSize: number,
    itemsCount: number
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/exit-paging`,
      null,
      {
        params: {
          sessionId,
          pageNumber: pageNumber.toString(),
          pageSize: pageSize.toString(),
          itemsCount: itemsCount.toString()
        }
      }
    );
  }

  deleteState(sessionId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/delete-state`, {
      params: { sessionId },
    });
  }
}
