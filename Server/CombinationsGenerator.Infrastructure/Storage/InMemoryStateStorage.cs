using CombinationsGenerator.Application.Models;
using CombinationsGenerator.Application.Services.Interfaces;
using System;
using System.Collections.Concurrent;

namespace CombinationsGenerator.Infrastructure.Storage
{
    public class InMemoryStateStorage : IStateStorage
    {
        private readonly ConcurrentDictionary<Guid, CombinationState> _stateStorage;

        public InMemoryStateStorage()
        {
            _stateStorage = new ConcurrentDictionary<Guid, CombinationState>();
        }

        public void SaveState(Guid sessionId, CombinationState state)
        {
            if (state == null)
            {
                throw new ArgumentNullException(nameof(state), "State cannot be null.");
            }

            _stateStorage[sessionId] = state;
        }

        public CombinationState GetState(Guid sessionId)
        {
            if (!_stateStorage.TryGetValue(sessionId, out var state))
            {
                throw new InvalidOperationException("Session not found.");
            }

            return state;
        }

        public void DeleteState(Guid sessionId)
        {
            if (!_stateStorage.TryRemove(sessionId, out _))
            {
                throw new InvalidOperationException("Failed to delete session. Session not found.");
            }
        }
    }
}