import './index.css'
import Header from './components/Header';
import Main from './components/Main';
import { useEffect, useReducer } from 'react';

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: ""
}

function reducer(state, action) {
  switch(action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      }
    case "dataFailed":
      return {
        ...state,
        status: 'error'
      }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then(res => res.json())
      .then(data => dispatch({type: 'dataReceived', payload: data}))
      .catch(err => dispatch({type: "dataFailed"}))
  }, [])
  
  return (
    <div>
      <Header />
      <Main>

      </Main>
    </div>
  )
}

export default App
