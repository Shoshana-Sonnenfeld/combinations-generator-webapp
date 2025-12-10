using CombinationsGenerator.Domain.Services.Abstractions;
using System;
using System.Collections.Generic;

namespace CombinationsGenerator.Domain.Services
{
    public class PermutationGenerator : IPermutationGenerator
    {
        private readonly long[] _factorialCache;

        public PermutationGenerator()
        {
            _factorialCache = new long[21]; // כולל אינדקס 0 עד 20
            _factorialCache[0] = 1; // 0! = 1
        }

        // Calculates the factorial of a number N using lazy calculation
        public long Factorial(int n)
        {
            if (n < 0 || n > 20)
                throw new ArgumentOutOfRangeException(nameof(n), $"N must be between 0 and 20. Received: {n}");

            if (_factorialCache[n] != 0)
                return _factorialCache[n];

            for (int i = 1; i <= n; i++)
            {
                if (_factorialCache[i] == 0)
                {
                    _factorialCache[i] = _factorialCache[i - 1] * i;
                }
            }

            return _factorialCache[n];
        }

        // Generates the permutation at the given index for numbers 1..N
        public List<int> GetPermutationByIndex(int n, long index)
        {
            if (n < 1 || n > 20)
                throw new ArgumentOutOfRangeException(nameof(n), $"N must be between 1 and 20. Received: {n}");

            long totalPermutations = Factorial(n);
            if (index < 0 || index >= totalPermutations)
                throw new ArgumentOutOfRangeException(nameof(index), $"Index is out of range. Received: {index}");

            var numbers = new List<int>(n);
            for (int i = 1; i <= n; i++)
            {
                numbers.Add(i);
            }

            var result = new List<int>(n);
            for (int i = n; i > 0; i--)
            {
                long factorial = Factorial(i - 1);
                int selectedIndex = (int)(index / factorial);
                result.Add(numbers[selectedIndex]);

                // Remove the selected element
                numbers.RemoveAt(selectedIndex);

                index %= factorial;
            }

            return result;
        }
    }
}
