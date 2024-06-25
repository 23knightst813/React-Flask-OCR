from flask import Flask, request
from flask_cors import CORS
import time
import http.client
import json
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import os


os.environ["CUDA_VISIBLE-DEVICES"] ="-1"
print(tf.__version__)

model = load_model('/workspace/AIy/blood_sweat_tears.h5')
# model = load_model('/workspace/AIy/model.keras')
# model = load_model('/workspace/AIy/my_model.keras')

app = Flask(__name__)
CORS(app)


# Function to preprocess the image blob
def preprocess_image(image_path):
    print('preprocess')
    # Load the image
    #invert

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)


    # Resize the image to 28x28 pixels
    img = cv2.resize(img, (28, 28))

    # Normalize the image
    img = img / 255.0
    # Reshape the image to match the input shape
    img = np.reshape(img, (1, 28, 28))
    # print(img)


    return img

# Function to predict the digit
def predict_digit(image_path):
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


def aiStuff(image_path):
    print('Beep Boop')
    result = predict_digit(image_path)
    print('#########################',result)
    return result



@app.route("/upload", methods=['POST'])
def upload():
        if 'file' not in request.files:
            return 'No file found'
        
        file = request.files['file']
        userId = file.filename
        image_path = 'zImage/' + userId + '.png'

        file.save(image_path)
        ocr_final = aiStuff(image_path)

        return ( 
            json.dumps({
                    "userID": userId,
                    "OCR": ocr_final
                })
                )





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')