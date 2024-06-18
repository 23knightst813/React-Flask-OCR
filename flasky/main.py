from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
# app.config["CORS_HEADERS"] = "Content-Type"
CORS(app)

@app.route("/", methods=['POST', 'GET'])
def hello():
    if request.method == 'POST':
        data = request.json
        data_num = data["number"]
        data_num = int(data_num) * 1
        print(data_num)
        return f'{data_num}'

    if request.method == 'GET':
        data = request.args
        data_num = data["number"]
        if data_num == None:
            return 'NO DATA'
        return str( int(data_num) * 2 )
    return 'Invalid request'

@app.route("/upload", methods=['POST'])
def upload():
        if 'file' not in request.files:
            return 'No file found'
        
        file = request.files['file']
        file.save('img.png')
        
        return 'File uploaded successfully'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')