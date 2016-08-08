export default function createStore (reducer, preloadedState) {

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners


  function getState () {

    return currentState

  }

  function subscribe (listener) {

    let isSubscribed = true

    nextListeners.push(listener)

    return function unsubscribe () {

      if (!isSubscribed) return
      
      isSubscribed = false
      
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      
    }

  }

  function dispatch (action) {

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Action type is undefined'
      )
    }

    currentState = currentReducer(currentState,action)

    const listeners = nextListeners
    listeners.map(function (listener) {
      listener()
    })

  }

  dispatch({ type: 'INIT' })

  return {
    dispatch: dispatch,
    getState: getState,
    subscribe: subscribe
  }

}