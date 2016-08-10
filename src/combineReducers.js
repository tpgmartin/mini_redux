import { ActionTypes } from './createStore'

export default function combineReducers(reducers) {

  const reducerKeys = Object.keys(reducers)
  const validKeys = []

  reducerKeys.filter(function (key) {
    if (typeof reducers[key] === 'function') validKeys.push(key) 
  })

  return function (state = {}, action) {

    validKeys.map(function (key) {
      state[key] = reducers[key](state[key], action)
    })

    return state

  }

}