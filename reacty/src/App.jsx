import React, { useEffect, useState } from "react";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [request_userId, setRequest_userId] = useState(null);
  const [request_OCR, setRequest_OCR] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);


    }
  };

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
  }, []);

  function imageUpload() {
    
    console.log("imageUpload");
    const formdata = new FormData();
    // const blob = new Blob([selectedImage], { type: "image/jpeg" });
    formdata.append("file", selectedImage, userId);
    
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    


    fetch("http://localhost:5000/upload", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setRequest_userId(result.userID);
        console.log(request_userId);
        // request_OCR = result.OCR;
        setRequest_OCR(result.OCR);
        console.log(request_OCR); 
        console.log(result)})
      .catch((error) => console.error("error", error));
  }
  


  return (
    <>
      <header className="idDisplay">
        <p>{userId}</p>
      </header>

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

      </form>
      {selectedImage && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: "50%" }} />
        <br/>
        <br/>
        <button onClick={imageUpload} className="submit-button" >Submit</button>
        </div>
      )}

        {request_userId === userId && (
          <div>
            <h3>Response Data:</h3>
            <p>User ID: {request_userId}</p>
            <p>OCR: {request_OCR}</p>
          </div>
        )}

        
      <div className="card">
        <button onClick={() => countW(count, setCount)}>count is  {count}</button>
      </div>
      <div className="card1">
        <button onClick={() => countW(count2, setCount2)}>count is {count2}</button>
      </div>
    </>
  );
}

export default App;
