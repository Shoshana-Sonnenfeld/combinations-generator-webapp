using CombinationsGenerator.Application.Models;
using System;

namespace CombinationsGenerator.Application.Services.Interfaces
{
    public interface IStateStorage
    {
        void SaveState(Guid sessionId, CombinationState state);
        CombinationState GetState(Guid sessionId);
        void DeleteState(Guid sessionId);
    }
}