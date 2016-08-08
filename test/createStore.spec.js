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

  it('supports multiple subscriptions', () => {

    const store = createStore(reducers.testAction)
    const listenerA = expect.createSpy(() => {})
    const listenerB = expect.createSpy(() => {})

    let unsubscribeA = store.subscribe(listenerA)
    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(1)
    expect(listenerB.calls.length).toBe(0)

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(2)
    expect(listenerB.calls.length).toBe(0)

    const unsubscribeB = store.subscribe(listenerB)
    expect(listenerA.calls.length).toBe(2)
    expect(listenerB.calls.length).toBe(0)

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(3)
    expect(listenerB.calls.length).toBe(1)

    unsubscribeA()
    expect(listenerA.calls.length).toBe(3)
    expect(listenerB.calls.length).toBe(1)

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(3)
    expect(listenerB.calls.length).toBe(2)

    unsubscribeB()
    expect(listenerA.calls.length).toBe(3)
    expect(listenerB.calls.length).toBe(2)

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(3)
    expect(listenerB.calls.length).toBe(2)

    unsubscribeA = store.subscribe(listenerA)
    expect(listenerA.calls.length).toBe(3)
    expect(listenerB.calls.length).toBe(2)

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(4)
    expect(listenerB.calls.length).toBe(2)
    
  })

  it('only removes listener once when unsubscribe is called', () => {
    const store = createStore(reducers.testAction)
    const listenerA = expect.createSpy(() => {})
    const listenerB = expect.createSpy(() => {})

    const unsubscribeA = store.subscribe(listenerA)
    store.subscribe(listenerB)

    unsubscribeA()
    unsubscribeA()

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listenerA.calls.length).toBe(0)
    expect(listenerB.calls.length).toBe(1)
  })

  it('only removes relevant listener when unsubscribe is called', () => {
    const store = createStore(reducers.testAction)
    const listener = expect.createSpy(() => {})

    store.subscribe(listener)
    const unsubscribeSecond = store.subscribe(listener)

    unsubscribeSecond()
    unsubscribeSecond()

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(listener.calls.length).toBe(1)
  })

  it('supports removing a subscription within a subscription', () => {
    const store = createStore(reducers.testAction)
    const listenerA = expect.createSpy(() => {})
    const listenerB = expect.createSpy(() => {})
    const listenerC = expect.createSpy(() => {})

    store.subscribe(listenerA)
    const unSubB = store.subscribe(() => {
      listenerB()
      unSubB()
    })
    store.subscribe(listenerC)

    store.dispatch({ type: 'UNKNOWN_ACTION' })
    store.dispatch({ type: 'UNKNOWN_ACTION' })

    expect(listenerA.calls.length).toBe(2)
    expect(listenerB.calls.length).toBe(1)
    expect(listenerC.calls.length).toBe(2)
  })

})