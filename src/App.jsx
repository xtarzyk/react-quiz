/* eslint-disable no-unused-vars */
import { useEffect, useReducer } from 'react';
import './index.css'
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0
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
    case "start":
      return {
        ...state,
        status: 'active'
      }
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null }
    case "finish":
      return { ...state, status: 'finished', highscore: state.points > state.highscore ? state.points : state.highscore }
    case "restart":
      return { ...state, status: 'ready', index: 0, points: 0, answer: null}
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce((acc, question) => acc += question.points, 0)

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then(res => res.json())
      .then(data => dispatch({type: 'dataReceived', payload: data}))
      .catch(_err => dispatch({type: "dataFailed"}))
  }, [])
  
  return (
    <div>
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              index={index} 
              numQuestions={numQuestions} 
              points={points} 
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question question={questions[index]} answer={answer} dispatch={dispatch} />
            <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
          </>
        )}
        {status === "finished" &&
          <FinishScreen 
            points={points} 
            maxPossiblePoints={maxPossiblePoints} 
            highscore={highscore}
            dispatch={dispatch}
          />
        }
      </Main>
    </div>
  )
}

export default App
