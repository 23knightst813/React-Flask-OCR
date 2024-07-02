import tensorflow as tf
from tensorflow.keras.layers import Layer
from tensorflow.keras.models import load_model

class CTCLayer(Layer):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

        # define the loss function
        self.loss_function = tf.keras.backend.ctc_batch_cost

    def call(self, y_true, y_hat):
        # Get the batch length
        batch_len = tf.cast(tf.shape(y_true)[0], dtype="int64")

        # get the input and label lengths
        input_len = tf.cast(tf.shape(y_hat)[1], dtype='int64') * tf.ones(shape=(batch_len, 1), dtype='int64')
        label_len = tf.cast(tf.shape(y_true)[1], dtype='int64') * tf.ones(shape=(batch_len, 1), dtype='int64')

        # calculate the loss
        loss = self.loss_function(y_true, y_hat, input_len, label_len)

        self.add_loss(loss)

        return y_hat



def load_Bilbo_model():
    model = load_model("AIy/models/AiModel-Bilbo_Baggins-v1.0.keras", custom_objects={'CTCLayer': CTCLayer})

    return model