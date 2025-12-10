using CombinationsGenerator.Application.DTOs;
using CombinationsGenerator.Application.Models;
using CombinationsGenerator.Application.Services.Abstractions;
using CombinationsGenerator.Domain.Services.Abstractions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace CombinationsGenerator.Application.Services
{
    public class CombinationService: ICombinationService
    {
        private readonly IPermutationGenerator _permutationGenerator;
        private readonly Dictionary<Guid, CombinationState> _userStates;
        private readonly int _minValue;
        private readonly int _maxValue;

        public CombinationService(IPermutationGenerator permutationGenerator, IConfiguration configuration)
        {
            _permutationGenerator = permutationGenerator;
            _userStates = new Dictionary<Guid, CombinationState>();
            _minValue = configuration.GetValue<int>("CombinationSettings:MinValue");
            _maxValue = configuration.GetValue<int>("CombinationSettings:MaxValue");
        }

        public (Guid sessionId, CombinationState state) StartSession(int n)
        {
            if (n < _minValue || n > _maxValue)
                throw new ArgumentOutOfRangeException(nameof(n), $"N must be between {_minValue} and {_maxValue}. Received: {n}");

            var sessionId = Guid.NewGuid();
            var totalPermutations = _permutationGenerator.Factorial(n);

            var state = new CombinationState
            {
                N = n,
                CurrentIndex = 0,
                TotalPermutations = totalPermutations,
                PagingBaseIndex = null
            };

            _userStates[sessionId] = state;

            return (sessionId, state);
        }

        public (List<int> permutation, long index, bool hasMore) GetNextPermutation(Guid sessionId)
        {
            if (!_userStates.ContainsKey(sessionId))
                throw new InvalidOperationException("Session not found.");

            var state = _userStates[sessionId];

            if (state.CurrentIndex >= state.TotalPermutations)
                throw new InvalidOperationException("No more permutations available.");

            // Calculate the next permutation directly by index
            var permutation = _permutationGenerator.GetPermutationByIndex(state.N, state.CurrentIndex);
            var currentIndex = state.CurrentIndex;
            state.CurrentIndex++;

            return (permutation, (long)(currentIndex + 1), state.CurrentIndex < state.TotalPermutations);
        }




        public PaginatedResult GetPaginatedPermutations(Guid sessionId, int pageSize, long pageNumber)
        {
            // 1. בדיקת קיום סשן
            if (!_userStates.TryGetValue(sessionId, out var state))
                throw new InvalidOperationException("Session not found.");

            // 2. בדיקות תקינות לקלט
            if (pageSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageSize), "Page size must be positive.");

            if (pageNumber <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageNumber), "Page number must be positive.");

            if (state.PagingBaseIndex == null)
            {
                state.PagingBaseIndex = state.CurrentIndex;
                state.PagingTotalCount = state.TotalPermutations - state.CurrentIndex;
            }


            long baseIndex = state.PagingBaseIndex.Value;
            long total = state.TotalPermutations;

            // 4. חישוב כמה קומבינציות נשארו להצגה
            long remaining = total - baseIndex;

            if (remaining <= 0)
            {

                {
                    throw new InvalidOperationException("No more permutations available to display.");
                }
            }

            // 5. חישוב מספר העמודים הכולל
            long totalPages = (long)Math.Ceiling((double)state.PagingTotalCount / pageSize);


            // 6. בדיקת חריגה בבקשת עמוד
            if (pageNumber > totalPages)
                throw new ArgumentOutOfRangeException(nameof(pageNumber), $"Page number exceeds total pages ({totalPages}).");

            // 7. חישוב האינדקס שממנו מתחילים לחשב קומבינציות בעמוד הנוכחי
            long startIndex = baseIndex + (pageNumber - 1) * pageSize;

            // 8. חישוב כמה בפועל להחזיר
            long endIndex = Math.Min(startIndex + pageSize, total);

            // 9. בניית רשימת התוצאות
            var results = new List<PermutationResult>();

            for (long i = startIndex; i < endIndex; i++)
            {
                var permutation = _permutationGenerator.GetPermutationByIndex(state.N, i);

                results.Add(new PermutationResult
                {
                    GlobalIndex = i + 1,
                    Permutation = permutation
                });
            }



            // 10. החזרת התוצאה ללקוח
            return new PaginatedResult
            {
                Permutations = results,
                TotalCount = state.TotalPermutations,
                PageNumber = pageNumber,
                PageSize = pageSize,
                HasPrevious = pageNumber > 1,
                HasNext = pageNumber < totalPages
            };
        }





        public void ExitPaging(Guid sessionId, long pageNumber, int pageSize, int itemsCount)
        {
            if (!_userStates.TryGetValue(sessionId, out var state))
                throw new InvalidOperationException("Session not found.");

            if (state.PagingBaseIndex == null)
                throw new InvalidOperationException("Paging mode is not active.");

            if (pageNumber <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageNumber));

            if (pageSize <= 0)
                throw new ArgumentOutOfRangeException(nameof(pageSize));

            if (itemsCount < 0 || itemsCount > pageSize)
                throw new ArgumentOutOfRangeException(nameof(itemsCount));

            // חישוב האינדקס שממנו ממשיכים במצב "אחד אחד"
            long nextIndex =
                state.PagingBaseIndex.Value +
                (pageNumber - 1) * pageSize +
                itemsCount;

            // הגנה מסוף הטווח
            state.CurrentIndex = Math.Min(nextIndex, state.TotalPermutations);

            // יציאה ממצב דפדוף
            state.PagingBaseIndex = null;
        }


        public void DeleteState(Guid sessionId)
        {
            if (!_userStates.ContainsKey(sessionId))
                throw new InvalidOperationException("Session not found.");

            _userStates.Remove(sessionId);
        }
    }
}