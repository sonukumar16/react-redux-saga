# Redux is synchronous
    As you probably know, Redux manages your application state synchronously.
    One of the main concepts of Redux is reducers.

> The reducer is a pure function that takes the previous state and an action, and returns the next state. It’s very important that 
  the reducer stays pure. Things you should never do inside  a reducer:

  Mutate its arguments;
    Perform side effects like API calls and routing transitions;
    Call non-pure functions, e.g. Date.now() or Math.random().`

* Side effects?
    A side effect is any code that runs asynchronously or talks to an external source to the application, for example:
    - Talking to a backend server
    - Logging (Splunk)
    - Collecting analytics data (Mixpanel, Google Analytics)
    - Accessing the browser’s local storage

* Middleware to the rescue!
    So what can we do if Redux can’t run side effects? We will use a middleware!

> middleware provides a third-party extension point between dispatching an action, and the moment it reaches the reducer

    Middlewares don’t come out of the box with redux. It is usually a package that we will install, or we can write one for our selves.
    But how do we choose a good middleware? Based on what criteria?

# Attributes of a good redux side-effects middleware
1. Access to the Redux store. This is helpful when we want to make some decisions based on our application’s state.
2.Ability to dispatch another action from within the middleware. This will allow us the flexibility to trigger other side effects that have different business logic.
3. Ability to run side effects — obviously.
4. Cancel side effect. Since side effects can be asynchronous, we might want to be able to cancel the asynchronous process before it ends and affects our application’s state. (for example, the user decides to cancel file uploading before it finishes uploading)
5. Allow the user to trigger some action multiple times (like clicking a refresh button). In this case, we want to be able to cancel all previous side effects and always keep the latest side effect running, to avoid unnecessary processing and to consistently correlate with the user’s actions.
6. Run the same specific side effect for different dispatched actions.
7. Debounce: delay the invocation of a side effect until after some milliseconds have elapsed since the last invocation. For example: autocomplete side effect.
8. Throttle: regulate the rate at which your application’s side effects are running, meaning prevent our side effect from running more than once every X milliseconds. For example, you can regulate the rate of a refresh button click.
9. Race: sometimes, we would like to race between multiple side effects, and when one of them finishes, we want to cancel all the rest since they are now redundant.
10. All: run multiple side effects in parallel, wait for all of them to finish, and only then do some other action.


# Redux-Saga
> “Sagas are implemented as generator functions that yield objects to the redux-saga middleware.”

``` import { createStore, applyMiddleware } from 'redux';
    import createSagaMiddleware from 'redux-saga';
    import reducer from './reducers';
    import rootSaga from './saga';

    // create the saga middleware
    export const sagaMiddleware = createSagaMiddleware();
    // mount it on the store
    const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
    );
    // run the saga
    sagaMiddleware.run(rootSaga);
```

When we create the Redux store, we also create our Redux-Saga middleware and connect it to the store via applyMiddleware. After the store was created, we call run with our root saga, which starts our redux-saga middleware.

# Watchers and Workers
- The main saga file is usually split into two different types of sagas: Watchers and workers
- Watcher saga sees every action that is dispatched to the redux store; if it matches the action it is told to handle, it will assign it to its worker saga
- The worker saga is running all the side effects it was meant to do
- The watcher saga is typically the root saga to export and mount on the store

# Effect Creators
Redux actions which serve as instructions for Saga middleware
1. select: returns the full state of the application
2. put: dispatch an action into the store (non-blocking)
3. call: run a method, Promise or other Saga (blocking)
4. take: wait for a redux action/actions to be dispatched into the store (blocking)
5. cancel: cancels the saga execution.
6. fork: performs a non-blocking call to a generator or a function that returns a promise. It is useful to call fork on each of the    sagas you want to run when you start your application since it will run all the sagas concurrently. (non-blocking)
7. debounce: the purpose of debounce is to prevent calling saga until the actions are settled off. Meaning, until the actions we listen on will not be dispatched for a given period. For example, dispatching autocomplete action will be processed only after 100 ms passed from when the user stopped typing.
8. throttle: the purpose of throttle is to ignore incoming actions for a given period while processing a task. For example, dispatching autocomplete action will be processed every 100 ms, while the processed action will be the last dispatched action in that period. It will help us to ensure that the user won’t flood our server with requests.
9. delay: block execution for a predefined number of milliseconds.

# Effect combinators:
1. race: a race between multiple sagas. When one of the sagas finishes, all the other sagas are canceled. similar to Promise.race([...])
fork and race are used for managing concurrency between Sagas.
2. all: run multiple Effects in parallel and wait for all of them to complete. similar to Promise.all

# Helpers:
1. takeEvery: takes every matching action and run the given saga (non-blocking)

    ``` 
        export function* watcherSaga() {
            yield takeEvery('SOME_ACTION', workerSaga);
        }
   ```
2. takeLatest: takes every matching action and run the given saga, but cancels every previous saga that is still running (blocking)

    ```   
        export function* watcherSaga() {
            yield takeLatest('SOME_ACTION', workerSaga);
        }
    ```


* [Article](https://medium.com/nmc-techblog/the-power-of-redux-saga-3dbd26a08b49)    
