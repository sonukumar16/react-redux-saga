import { put, takeLatest, all } from "redux-saga/effects";

function* fetchPost() {
  const data = yield fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  ).then((res) => res.json());
  yield put({ type: "NEWS_RECEIVED", data });
}

function* actionWatcher() {
  yield takeLatest("GET_NEWS", fetchPost);
}

export default function* rootSaga() {
  yield all([actionWatcher()]);
}
