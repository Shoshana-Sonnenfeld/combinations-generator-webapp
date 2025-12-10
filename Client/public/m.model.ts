import { Combination } from "../src/app/core/models/domain/combination.model";

export interface ServerAllCombinationsResponse {
  permutations: Combination[];
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}