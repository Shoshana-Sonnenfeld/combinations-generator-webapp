import { Combination } from '../domain/combination.model';

export interface AllCombinationsPageResponse {
  permutations: Combination[];
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
