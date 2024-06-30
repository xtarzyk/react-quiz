import { useEffect } from "react"

export default function Timer({ dispatch, secondsRemains }) {
  const mins = Math.floor(secondsRemains / 60)
  const secs = secondsRemains % 60

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "tick" })
    }, 1000);

    return () => clearInterval(intervalId)
  }, [dispatch])

  return (
    <div className="timer">{mins < 10 && "0"}{mins}:{secs < 10 && "0"}{secs}</div>
  )
}
