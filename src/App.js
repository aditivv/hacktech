import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [debateQuestion, setDebateQuestion] = useState("");
  const [age, setAge] = useState(6);

  const [iPadArguments, setIPadArguments] = useState([]);
  const [iPadTraits, setIPadTraits] = useState({});

  const [normalArguments, setNormalArguments] = useState([]);
  const [normalTraits, setNormalTraits] = useState({});

  useEffect(() => {
    console.log(age);
  }, [age])

  const iPadSpeaks = async () => {
    const response = await fetch("http://localhost:8001/ipad_kid_response", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        age: age,
        debate_q: debateQuestion,
        argument: iPadArguments,
        traits: iPadTraits
      })
    })

    const res = await response.json();
    setIPadArguments((prev) => [...prev, res.rebuttal])
    setIPadTraits((prev) => [...prev, res.traits])
  }

  const normalSpeaks = async () => {
    const response = await fetch('http://localhost:8001/normal_kid_response', {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        age: age, 
        debate_q: debateQuestion, 
        argument: normalArguments, 
        traits: normalTraits
      })
    })

    const res = await response.json();
    setNormalArguments((prev) => [...prev, res.rebuttal])
    setNormalTraits((prev) => [...prev, res.traits])
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <input
          type="text"
          value={debateQuestion}
          placeholder="Enter a debate question"
          onChange={(e) => setDebateQuestion(e.target.value)}
        />

        <button
          onClick = {() => {
            // ipad kid speaks first, normal kid speaks second (TBD)
            iPadSpeaks();
            normalSpeaks();
          }}
        >
          Start Debate
        </button> 
        
        <input
          type="range"
          min={6}
          max={24}
          step={6}
          value = {age}
          onChange={(e) => setAge(e.target.value)}
        />
      </header>
    </div>
  );
}

export default App;
