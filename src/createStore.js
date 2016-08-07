export default function createStore (reducer, preloadedState) {

  let currentReducer = reducer
  let currentState = preloadedState

  function getState () {

    return currentState

  }

  function dispatch (action) {

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Action type is undefined'
      )
    }

    currentState = currentReducer(currentState,action)

  }

  dispatch({ type: 'INIT' })

  return {
    dispatch: dispatch,
    getState: getState
  }

}