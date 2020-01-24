import { useState } from "react";


export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);

  const [history, setHistory] = useState([initialMode]);

  function transition(next, replace = false) {
    if (replace) {
      setMode(next)
      history.splice(history.length-1, 1, next)
    } else {
      setMode(next)
      setHistory([...history, next])
    }
  };

  function back() {
    if (history.length === 1) {
      setMode(history[0])
    } else {
      history.pop()
      setMode(history[history.length - 1])
    }
  };
  return {
    mode,
    transition,
    back
  }
}