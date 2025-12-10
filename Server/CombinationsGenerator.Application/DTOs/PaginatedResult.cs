using System.Collections.Generic;

namespace CombinationsGenerator.Application.DTOs
{


    public class PaginatedResult
    {
        public List<PermutationResult> Permutations { get; set; } = new List<PermutationResult>();
        public long TotalCount { get; set; }
        public long PageNumber { get; set; }
        public int PageSize { get; set; }
        public bool HasNext { get; set; }
        public bool HasPrevious { get; set; }
    }
}