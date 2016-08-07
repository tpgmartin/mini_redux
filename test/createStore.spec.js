import expect from 'expect'
import { createStore } from '../src/index'

let reducers =  {
  testAction: (state = [], action) => {
    switch (action.type) {
    case 'ADD_TEXT': 
      return [
        ...state,
        { text: action.text }
      ]
    default:
      return state
    }
  }
}

describe('createStore', () => {

  it('passes the initial action and state', () => {

    const preloadedState = [ 'initialState' ]
    const store = createStore(reducers.testAction, preloadedState)

    expect(store.getState()).toEqual(preloadedState)

  })

  it('applies the reducer to the previous state', () => {

    const store = createStore(reducers.testAction)

    expect(store.getState()).toEqual([])

  })

  it('applies the reducer to the initial state', () => {

    const store = createStore(reducers.testAction, [{ text: 'Hello' }])
    expect(store.getState()).toEqual([{ text: 'Hello' }])

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(store.getState()).toEqual([{ text: 'Hello' }])

    store.dispatch({ type: 'ADD_TEXT', text: 'World' })
    expect(store.getState()).toEqual([{ text: 'Hello' }, { text: 'World' }])

  })

})