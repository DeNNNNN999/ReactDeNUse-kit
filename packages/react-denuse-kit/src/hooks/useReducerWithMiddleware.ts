import { useCallback, useReducer, useRef } from 'react';

type Reducer<S, A> = (state: S, action: A) => S;
type Dispatch<A> = (action: A) => void;

interface Store<S, A> {
  getState: () => S;
  dispatch: Dispatch<A>;
}

type Middleware<S, A> = (store: Store<S, A>) => (next: Dispatch<A>) => Dispatch<A>;

export function useReducerWithMiddleware<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  middlewares: Middleware<S, A>[] = []
): [S, Dispatch<A>] {
  const [state, baseDispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const store: Store<S, A> = {
    getState: () => stateRef.current,
    dispatch: () => {
      throw new Error('Dispatch not initialized');
    },
  };

  const dispatch = useCallback((action: A) => {
    let dispatchChain = baseDispatch;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      const next = dispatchChain;
      dispatchChain = middleware(store)(next);
    }

    dispatchChain(action);
  }, [middlewares, baseDispatch, store]);

  store.dispatch = dispatch;

  return [state, dispatch];
}

export const loggerMiddleware: Middleware<any, any> = (store) => (next) => (action) => {
  console.group(`Action: ${action.type || 'Unknown'}`);
  console.log('Previous State:', store.getState());
  console.log('Action:', action);
  
  const result = next(action);
  
  console.log('Next State:', store.getState());
  console.groupEnd();
  
  return result;
};

export const thunkMiddleware: Middleware<any, any> = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  
  return next(action);
};

export const devtoolsMiddleware: Middleware<any, any> = (store) => (next) => {
  const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  
  if (!devtools) {
    return next;
  }

  const devtoolsInstance = devtools.connect();
  
  return (action) => {
    const result = next(action);
    devtoolsInstance.send(action, store.getState());
    return result;
  };
};

interface AsyncAction<S, A> {
  type: string;
  payload?: any;
  meta?: {
    isAsync?: boolean;
    isPending?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
    error?: any;
  };
}

export function createAsyncMiddleware<S, A extends AsyncAction<S, A>>(): Middleware<S, A> {
  return (store) => (next) => async (action) => {
    if (!action.meta?.isAsync) {
      return next(action);
    }

    const { type, payload } = action;

    next({ 
      type: `${type}_PENDING`, 
      meta: { isPending: true } 
    } as A);

    try {
      const result = typeof payload === 'function' ? await payload() : await payload;
      
      next({ 
        type: `${type}_SUCCESS`, 
        payload: result,
        meta: { isSuccess: true } 
      } as A);
      
      return result;
    } catch (error) {
      next({ 
        type: `${type}_ERROR`, 
        payload: error,
        meta: { isError: true, error } 
      } as A);
      
      throw error;
    }
  };
}