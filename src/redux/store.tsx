import { createStore, combineReducers, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import { reducer, swapreducer } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

export const rootReducer = combineReducers({ reducer: reducer, swapreducer: swapreducer })

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);


export type AppState = ReturnType<typeof store.getState>

