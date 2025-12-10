using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CombinationsGenerator.Application.DTOs
{
    public class PermutationResult
    {
        public List<int> Permutation { get; set; }
        public long GlobalIndex { get; set; }
    }
}
