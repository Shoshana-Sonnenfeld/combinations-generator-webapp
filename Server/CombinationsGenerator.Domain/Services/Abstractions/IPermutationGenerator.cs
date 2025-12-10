using System;
using System.Collections.Generic;

namespace CombinationsGenerator.Domain.Services.Abstractions
{
    public interface IPermutationGenerator
    {
        long Factorial(int n);
        List<int> GetPermutationByIndex(int n, long index);
    }
}
