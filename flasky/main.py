import http.client
import json
import os
import shutil
import time

#Block optional errrors filling up the terminal
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import cv2
import kagglehub
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from flask import Flask, request
from flask_cors import CORS
from tensorflow.keras.models import load_model


os.environ["CUDA_VISIBLE-DEVICES"] ="-1"
print(tf.__version__)


app = Flask(__name__)
CORS(app)


@app.route("/models", methods=['GET'])
def modelsGet():
    print('models')
    model_location = "AIy/models"
    model_files = []
    for filename in os.listdir(model_location):
        model_files.append(filename)

    if not model_files:
            print('nuhuh')
            new_model_file = saveWebModel()
            model_files.append(new_model_file)
    return json.dumps(model_files)



def saveWebModel():
    # Download latest version
    downloaded_dir = kagglehub.model_download("henrygucao/handwritten-numerical-digits-classifier/keras/best")

    # Find the .h5 file in the downloaded directory
    path = next((os.path.join(downloaded_dir, file) for file in os.listdir(downloaded_dir) if file.endswith(".h5")), None)

    # Define the destination folder
    destination_folder = "AIy/models"

    # Move the .h5 file to the destination folder
    destination_path = os.path.join(destination_folder, "number_classifier.h5")
    shutil.move(path, destination_path)

    return 'number_classifier.h5'

# Function to preprocess the image blob
def preprocess_image(image_path):
    print('preprocess')
    # Load the image
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    #invert
    img = cv2.bitwise_not(img)

    # Resize the image to 28x28 pixels
    img = cv2.resize(img, (28, 28))


    # Save the image
    cv2.imwrite('/workspace/AIy/saved_image.png', img)
    # Normalize the image
    img = img / 255.0


    # Reshape the image to match the input shape
    img = np.reshape(img, (1, 28, 28))

    return img

# Function to predict the digit
def predict_digit(image_path ,model):
    # mnist = tf.keras.datasets.mnist
    # (x_tr, y_tr), (x_test, y_test) = mnist.load_data()
    # x_tr, x_test = x_tr/255.0, x_test/255.0
    # Preprocess the image
    img = preprocess_image(image_path)

    # Make a prediction
    predictions = model.predict(img)
    # print(predictions)
    # Get the predicted class
    predicted_class = np.argmax(predictions)
    # print(predicted_class)
    # Convert numpy.int64 type to native Python int type
    return int(predicted_class)



def aiStuff(image_path,model_path):
    print('Beep Boop')
    model = load_model(model_path)
    result = predict_digit(image_path , model)
    print('#########################',result)
    return result



@app.route("/upload", methods=['POST'])
def upload():
        if 'file' not in request.files:
            return 'No file found'
        
        file = request.files['file']
        model = request.form.get('model', 'AiModel-sauron-v1.5.keras') # use sauron as defult 
        userId = file.filename
        image_path = 'zimagey/' + userId + '.png'
        model_path = ('AIy/models/' + str(model))
        file.save(image_path)
        ocr_final = aiStuff(image_path,model_path)

        return ( 
            json.dumps({
                    "userID": userId,
                    "OCR": ocr_final,
                    "model": model
                })
                )






if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')