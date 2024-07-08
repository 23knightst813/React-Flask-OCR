import React, { useEffect, useState } from "react";
import ReactiveButton from 'reactive-button';
import CanvasDraw from "react-canvas-draw";
import "./App.css";


function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [request_userId, setRequest_userId] = useState(null);
  const [request_OCR, setRequest_OCR] = useState(null);
  const [request_model, setrequest_model] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const canvasRef = React.createRef();
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [history, setHistory] = useState([]);

  const handlePaste = async () => {
    const clipboardItems = await navigator.clipboard.read();
    let imageFound = false;
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const blob = await clipboardItem.getType(type);
          console.log(blob);
          setSelectedImage(blob);
          imageFound = true;
        }
      }
    }
    if (!imageFound) {
      alert('No image found in clipboard');
    }
  };

  function handleHistoryUpdate(OCR , model) {
    // console.log('Retrieve the existing history')
    var retrievedData = localStorage.getItem('History');

    // console.log('Convert this string back')
    var History = retrievedData ? JSON.parse(retrievedData) : [];

    // console.log('Create a new entry')
    var newEntry = {
        OCR: OCR,
        date: new Date().toLocaleDateString('en-GB'),
        model: model
    };

    // console.log('Append new entry to the history')
    History.push(newEntry);

    // console.log('Stringify the updated history')
    var updatedHistoryString = JSON.stringify(History);

    // console.log('Store the updated history back in local storage')
    localStorage.setItem('History', updatedHistoryString);
}

function getHistoryFromStorage() {
  // Retrieve the JSON string from local storage
  const historyString = localStorage.getItem('History');

  // Check if the history string exists
  if (historyString) {
    // Parse the JSON string to its original format
    const history = JSON.parse(historyString);
    return history;
  } else {
    // Return an empty array if there is no history
    return [];
  }
}


  const handleImageUpload = (event) => {
    // showCanvas && setShowCanvas(false);
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  function handleModelChange(event) {
    setSelectedModel(event.target.value);
  }

  useEffect(() => {
    // Check if user ID already exists in local storage
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      // Generate a unique user ID
      const uniqueId = `User_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      localStorage.setItem('userId', uniqueId);
      storedUserId = uniqueId;
    }
    setUserId(storedUserId);
  
    getModels().then(models => {
      setModels(models);
      setSelectedModel(models[0]);
    });
  
    const pasteHandler = (event) => {
      handlePaste();
      event.preventDefault(); // stop normal paste action
    };
    window.addEventListener('paste', pasteHandler);

    

    setHistory(getHistoryFromStorage());
  }, []);


  function clearHistory() {
    localStorage.removeItem('History');
    setHistory([]);
  }



  function uploadFile(file, endpoint) {
    const formdata = new FormData();
    formdata.append("file", file, userId);
    formdata.append("model", selectedModel); // Add the selected model to the request
    console.log(selectedModel);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
  
    let time = Date.now();
    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        time = Date.now() - time;
        console.log(time)
        setRequest_userId(result.userID);
        // console.log(request_userId);
        setRequest_OCR(result.OCR);
        // console.log(request_OCR); 
        setrequest_model(result.model);
        // console.log(request_model);
        console.log('Adding to history');
        handleHistoryUpdate(result.OCR, selectedModel); // Add the OCR + model result to the history
        setHistory(getHistoryFromStorage()); // Update the history state
        console.log(result);
      })
      .catch((error) => console.error("error", error));
    }

  function getModels() {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
  
    return fetch("http://127.0.0.1:5000/models", requestOptions)
      .then((response) => response.json()) // parse the response as JSON
      .catch((error) => console.error(error));
  }


  function imageUpload() {
    uploadFile(selectedImage, "http://localhost:5000/upload");
  }
  
  const saveDrawing = () => {
    const canvas = canvasRef.current.canvasContainer.children[1];
    const ctx = canvas.getContext('2d');
    
    // Save the current drawing state
    ctx.save();
    
    // Draw a white background
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore the drawing state
    ctx.restore();
    
    // Convert to Blob
    canvas.toBlob((blob) => {
      console.log('PNG Blob:', blob);
      uploadFile(blob, "http://localhost:5000/upload");
    }, 'image/png');
  };
  
  const clearDrawing = () => {
    canvasRef.current.clear();
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance('The number is ' + text);
    window.speechSynthesis.speak(utterance);
  };


  return (
    <>


    <p className="title" tabIndex="-1">Handwritten Digit Recognition</p>

    <br/>

    <div className="History" tabIndex="-1">
      <h3 tabIndex="-1">History</h3>
      <ul className="HistoryList">
        {getHistoryFromStorage().reverse().map((entry, index) => (
          <p key={index}>{entry.date} - {entry.model} - {entry.OCR}</p>
        ))}
      </ul>
      <button className="ClearHistory" onClick={() => clearHistory()} tabIndex="-1">Clear History</button>
    </div>

    <div className="idDisplay" aria-hidden="true" tabIndex="-1">
      <p>{userId}</p>
    </div>

    <div aria-hidden="true" className='modelDrop' tabIndex="-1">
      <label htmlFor="model">Choose a model:</label>
      <br/>
      <select aria-label="Ai-model-selection" value={selectedModel} onChange={handleModelChange} tabIndex="-1" >
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>


    <div className="menu">

    <button tabIndex="0" className="pasteButton" onClick={handlePaste}>Paste</button>



    <form >
      <label tabIndex="0" htmlFor="myFile" className="custom-file-upload">
        Choose File
      </label>
      <input
        type="file"
        id="myFile"
        name="filename"
        accept="image/*"
        onChange={handleImageUpload}
        tabIndex="-1"
      />
      <br />      


    </form>
    <button tabIndex="0" className="showCanvas" onClick={() => setShowCanvas(true)}>Draw</button>
    {selectedImage && (
      <div tabIndex="-1" className="ShownImage">
        <h3>Uploaded Image:</h3>
        <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: "18vh" }} />
        <br/>
        <br/>
        <button onClick={imageUpload} className="submit-button" tabIndex="1">Submit</button>
      </div>
    )}

    { showCanvas && (
      <div tabIndex="-1" className="ShownCanvas">
        <p>Draw A Digit:</p>
        
        <CanvasDraw
          ref={canvasRef}
          brushColor="#000000"
          brushRadius={6}
          canvasWidth={300}
          canvasHeight={300}
          tabIndex="-1"
        />
        
        <div className="CanvasButtons">
      <button onClick={clearDrawing} tabIndex="1">Clear</button>
      <button onClick={() => saveDrawing()} tabIndex="1">Submit</button>
    </div>
  </div>
)}


    </div>

    {request_userId === userId && (
      <div tabIndex="-1">
        <h3>Response Data:</h3>
        <p>User ID: {request_userId}</p>
        <p>OCR: {request_OCR}</p>
        <p>Model: {request_model}</p>

        <button tabIndex="1" onClick={() => speak(request_OCR)} style={{ margin: 5, fontSize: 13 }}>Read OCR</button>
        <button tabIndex="1" onClick={() => navigator.clipboard.writeText(request_OCR)} style={{ margin: 5, fontSize: 13 }}>Copy OCR</button>
      </div>
    )}
    </>
  );
}

export default App;