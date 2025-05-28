import { useCallback, useReducer } from 'react';

interface UndoState<T> {
  past: T[];
  present: T;
  future: T[];
}

type UndoAction<T> =
  | { type: 'SET'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; payload: T }
  | { type: 'CLEAR' };

function undoReducer<T>(state: UndoState<T>, action: UndoAction<T>): UndoState<T> {
  switch (action.type) {
    case 'SET': {
      if (Object.is(action.payload, state.present)) {
        return state;
      }
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };
    }
    
    case 'UNDO': {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    
    case 'REDO': {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    
    case 'RESET': {
      return {
        past: [],
        present: action.payload,
        future: [],
      };
    }
    
    case 'CLEAR': {
      return {
        past: [],
        present: state.present,
        future: [],
      };
    }
    
    default:
      return state;
  }
}

interface UseUndoOptions {
  maxHistory?: number;
}

interface UseUndoReturn<T> {
  value: T;
  setValue: (value: T) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  reset: (value: T) => void;
  canUndo: boolean;
  canRedo: boolean;
  history: {
    past: T[];
    future: T[];
  };
}

export function useUndo<T>(
  initialValue: T,
  options: UseUndoOptions = {}
): UseUndoReturn<T> {
  const { maxHistory = 100 } = options;
  
  const [state, dispatch] = useReducer(undoReducer<T>, {
    past: [],
    present: initialValue,
    future: [],
  });

  const setValue = useCallback((value: T) => {
    dispatch({ type: 'SET', payload: value });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const reset = useCallback((value: T) => {
    dispatch({ type: 'RESET', payload: value });
  }, []);

  const trimmedState = {
    ...state,
    past: state.past.slice(-maxHistory),
  };

  return {
    value: trimmedState.present,
    setValue,
    undo,
    redo,
    clear,
    reset,
    canUndo: trimmedState.past.length > 0,
    canRedo: trimmedState.future.length > 0,
    history: {
      past: trimmedState.past,
      future: trimmedState.future,
    },
  };
}