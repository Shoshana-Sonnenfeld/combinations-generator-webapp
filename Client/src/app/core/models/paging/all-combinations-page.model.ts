import { Combination } from '../domain/combination.model';

export interface AllCombinationsPage {
  permutations: Combination[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
