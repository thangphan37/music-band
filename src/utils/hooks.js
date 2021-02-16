import * as React from 'react'

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(true)

  React.useEffect(() => {
    return () => (mounted.current = false)
  }, [])

  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

const defaultState = {status: 'idle', data: null, error: null}
function useAsync(initialState = {}) {
  const defaultInitialState = React.useRef({
    ...defaultState,
    ...initialState,
  })

  const [{status, data, error}, dispatch] = React.useReducer(
    (s, a) => ({...s, ...a}),
    defaultInitialState.current,
  )
  const safeDispatch = useSafeDispatch(dispatch)

  const setData = React.useCallback(
    (data) => safeDispatch({data, status: 'success'}),
    [safeDispatch],
  )
  const setError = React.useCallback(
    (error) => safeDispatch({error, status: 'error'}),
    [safeDispatch],
  )
  const reset = React.useCallback(() => safeDispatch(defaultInitialState), [
    safeDispatch,
  ])
  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error('params must be passed as a promise')
      }

      safeDispatch({status: 'loading'})
      return promise.then(
        (data) => setData(data),
        (error) => {
          setError(error)

          throw new Error(error)
        },
      )
    },
    [setData, setError, safeDispatch],
  )

  return {
    status,
    data,
    error,
    run,
    reset,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  }
}

export {useAsync}
