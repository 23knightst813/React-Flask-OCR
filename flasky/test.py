import os
import json
model_location = "AIy/models"
model_files = {}
for filename in os.listdir(model_location):
    file_path = os.path.join(model_location, filename)
    model_files[filename] = file_path

print(json.dumps(model_files))
