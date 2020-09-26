import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from "./common";
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createSocketMiddleware } from "./middleware/socketMiddleware";

const socketMiddleware = createSocketMiddleware();

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant(), socketMiddleware, sagaMiddleware)));

	return store;
}