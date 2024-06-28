import React, { useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import "./App.css";


// function countW(count, setCount) {
//   setCount((count) => count + 1);
//   // console.log(count);
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   const raw = JSON.stringify({
//     number: count,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };

//   fetch("http://localhost:5000", requestOptions)
//     .then((response) => response.text())
//     .then((result) => console.log(result))
//     .catch((error) => console.error(error));
// }


function App() {
  // const [count, setCount] = useState(0);
  // const [count2, setCount2] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [request_userId, setRequest_userId] = useState(null);
  const [request_OCR, setRequest_OCR] = useState(null);
  const [RequestModel, setRequestModel] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const canvasRef = React.createRef();
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  
  

  const handleImageUpload = (event) => {
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
  }, []);


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
  
    fetch(endpoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setRequest_userId(result.userID);
        console.log(request_userId);
        setRequest_OCR(result.OCR);
        console.log(request_OCR); 
        setRequestModel(result.model);
        console.log(RequestModel);
        console.log(result)})
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


  return (
    <>
      <header className="idDisplay">
        <p>{userId}</p>
      </header>

      <div className='modelDrop'>
      <label htmlFor="model">Choose a model:</label>
      <br/>
      <select value={selectedModel} onChange={handleModelChange}>
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>

      <form >
        <label htmlFor="myFile" className="custom-file-upload">
          Choose File
        </label>
        <input
          type="file"
          id="myFile"
          name="filename"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <br />
        <p>or</p>



      </form>
        <button className="showCanvas" onClick={() => setShowCanvas(true)}>Draw</button>
      {selectedImage && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: "50%" }} />
        <br/>
        <br/>
        <button onClick={imageUpload} className="submit-button" >Submit</button>
        </div>
      )}

      { showCanvas && (
        <div>
          <p>Draw your image</p>
          
          <CanvasDraw
            ref={canvasRef}
            brushColor="#000000"
            brushRadius={6}
            canvasWidth={300}
            canvasHeight={300}
          />
          <br/>
        <button onClick={() => clearDrawing()}>Clear</button>
        <button onClick={() => saveDrawing()}>Submit</button>


        </div>
      )}

        {request_userId === userId && (
          <div>
            <h3>Response Data:</h3>
            <p>User ID: {request_userId}</p>
            <p>OCR: {request_OCR}</p>
            <p>Model: {RequestModel}</p>
          </div>
        )}

      
      {/* <div className="card">
        <button onClick={() => countW(count, setCount)}>count is  {count}</button>
      </div> */}
    </>
  );
}

export default App;
