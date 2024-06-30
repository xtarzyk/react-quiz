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
import Footer from './components/Footer';
import Timer from './components/Timer';

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemains: null
}

const SECONDS_PER_QUESTION = 20

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
        status: 'active',
        secondsRemains: state.questions.length * SECONDS_PER_QUESTION
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
    case "tick":
      return { ...state, secondsRemains: state.secondsRemains - 1, status: state.secondsRemains === 0 ? "finished" : state.status }
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemains }, dispatch] = useReducer(reducer, initialState)

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
            <Footer>
              <Timer dispatch={dispatch} secondsRemains={secondsRemains} />
              <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
            </Footer>
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
