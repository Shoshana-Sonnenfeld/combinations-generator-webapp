using CombinationsGenerator.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Numerics;

namespace CombinationsGenerator.Api.Controllers
{
    [ApiController]
    [Route("api/combinations")]
    public class CombinationsController : ControllerBase
    {
        private readonly CombinationService _combinationService;
        private readonly int _minValue;
        private readonly int _maxValue;

        public CombinationsController(CombinationService combinationService, IConfiguration configuration)
        {
            _combinationService = combinationService;
            _minValue = configuration.GetValue<int>("CombinationSettings:MinValue");
            _maxValue = configuration.GetValue<int>("CombinationSettings:MaxValue");
        }

        [HttpPost("start")]
        public IActionResult StartSession([FromBody] int n)
        {
            if (n < _minValue || n > _maxValue)
            {
                return BadRequest(new { error = $"N must be between {_minValue} and {_maxValue}." });
            }

            try
            {
                var (sessionId, state) = _combinationService.StartSession(n);
                return Ok(new { sessionId, state.TotalPermutations, state.CurrentIndex });
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("next")]
        public IActionResult GetNextPermutation([FromQuery] Guid sessionId)
        {
            try
            {
                var result = _combinationService.GetNextPermutation(sessionId);
                return Ok(new { result.permutation, result.index, result.hasMore });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("all")]
        public IActionResult GetPaginatedPermutations([FromQuery] Guid sessionId, [FromQuery] int pageSize, [FromQuery] long pageNumber)
        {
            try
            {
                var result = _combinationService.GetPaginatedPermutations(sessionId, pageSize, pageNumber);
                return Ok(new
                {
                    result.Permutations,
                    result.TotalCount,
                    result.PageNumber,
                    result.PageSize,
                    result.HasNext,
                    result.HasPrevious
                });
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPost("exit-paging")]
        public IActionResult ExitPaging(
    [FromQuery] Guid sessionId,
    [FromQuery] long pageNumber,
    [FromQuery] int pageSize,
    [FromQuery] int itemsCount)
        {
            try
            {
                _combinationService.ExitPaging(sessionId, pageNumber, pageSize, itemsCount);
                return Ok(new { message = "Returned to single-permutation mode successfully." });
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("delete-state")]
        public IActionResult DeleteState([FromQuery] Guid sessionId)
        {
            try
            {
                _combinationService.DeleteState(sessionId);
                return Ok(new { message = "State deleted successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
            }
        }
    }
}


//        [HttpPost("exit-paging")]
//        public IActionResult ExitPaging(
//[FromQuery] Guid sessionId
//)
//        {
//            try
//            {
//                _combinationService.ExitPaging(sessionId);
//                return Ok(new { message = "Returned to single-permutation mode successfully." });
//            }
//            catch (ArgumentOutOfRangeException ex)
//            {
//                return BadRequest(new { error = ex.Message });
//            }
//            catch (InvalidOperationException ex)
//            {
//                return BadRequest(new { error = ex.Message });
//            }
//             }

//        }
