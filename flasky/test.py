import kagglehub
import os
import shutil

# Download latest version
downloaded_dir = kagglehub.model_download("henrygucao/handwritten-numerical-digits-classifier/keras/best")

# Find the .h5 file in the downloaded directory
path = next((os.path.join(downloaded_dir, file) for file in os.listdir(downloaded_dir) if file.endswith(".h5")), None)

# Define the destination folder
destination_folder = "AIy/models"

# Move the .h5 file to the destination folder if path is not None
if path is not None:
    destination_path = os.path.join(destination_folder, "number_classifier.h5")
    shutil.move(path, destination_path)
    print("Saved file name:", os.path.basename(destination_path))
else:
    print("No .h5 file found in the downloaded directory.")
