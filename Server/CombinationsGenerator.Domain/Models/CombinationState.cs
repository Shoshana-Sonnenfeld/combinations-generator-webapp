namespace CombinationsGenerator.Application.Models
{
    public class CombinationState
    {
        public int N { get; set; }
        public long CurrentIndex { get; set; }
        public long TotalPermutations { get; set; }
        public long? PagingBaseIndex { get; set; }

        public long PagingTotalCount { get; set; }

        // Paging session state
        //public long? PagingStartIndex { get; set; }          // מאיפה נכנסנו לדפדוף
        //public long? PagingLastViewedIndex { get; set; }     // הקומבינציה האחרונה שהמשתמש ראה
    }

}
