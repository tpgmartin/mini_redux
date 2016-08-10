import expect from 'expect'
import { combineReducers } from '../src'
import createStore, { ActionTypes } from '../src/createStore'

describe('combineReducers', () => {

  it('returns a composite reducer that maps the state keys to given reducers', () => {
    const reducer = combineReducers({
      counter: (state = 0, action) =>
        action.type === 'increment' ? state + 1 : state,
      stack: (state = [], action) =>
        action.type === 'push' ? [...state, action.value] : state
    })

    const s1 = reducer({}, { type: 'increment' })
    expect(s1).toEqual({ counter: 1, stack: [] })
    const s2 = reducer(s1, { type: 'push', value: 'a' })
    expect(s2).toEqual({ counter: 1, stack: ['a'] })
  })

  it('ignores all props which are not a function', () => {
    const reducer = combineReducers({
      fake: true,
      broken: 'string',
      another: { nested: 'object' },
      stack: (state = []) => state
    })

    expect(
      Object.keys(reducer({}, { type: 'push' }))
    ).toEqual(['stack'])
  })

})
