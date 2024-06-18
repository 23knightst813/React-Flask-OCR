import { useState } from "react";
import "./App.css";



function countW(count, setCount) {
  setCount((count) => count + 1);
  // console.log(count);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    number: count,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5000", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function App() {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <>
        <div className="card">
          <button onClick={() => countW(count, setCount)}>count is {count}</button>
        </div>
        <div className="card1">
          <button onClick={() => countW(count2, setCount2)}>count is {count2}</button>
        </div>
    </>
  );
}

export default App;
