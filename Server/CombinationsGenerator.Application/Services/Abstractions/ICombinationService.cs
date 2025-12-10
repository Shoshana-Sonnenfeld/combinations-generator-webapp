using CombinationsGenerator.Application.DTOs;
using CombinationsGenerator.Application.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CombinationsGenerator.Application.Services.Abstractions
{
    public interface ICombinationService
    {

        public (Guid sessionId, CombinationState state) StartSession(int n);
        public (List<int> permutation, long index, bool hasMore) GetNextPermutation(Guid sessionId);
        public PaginatedResult GetPaginatedPermutations(Guid sessionId, int pageSize, long pageNumber);

        public void ExitPaging(Guid sessionId, long pageNumber, int pageSize, int itemsCount);
        public void DeleteState(Guid sessionId);


    }
}
