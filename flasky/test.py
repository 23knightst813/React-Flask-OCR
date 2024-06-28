from keras.models import load_model

# Load the .h5 model
model = load_model('/workspace/AIy/models/blood_sweat_tears.h5')

# Save the model to .keras format
model.save('/workspace/AIy/models/blood_sweat_tears.keras')