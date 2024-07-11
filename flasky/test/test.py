# FILEPATH: /workspace/flasky/test_main.py
import unittest
import json
from flask_testing import TestCase
import sys
sys.path.insert(0, '/workspace/flasky/test')
from main import app

class FlaskTestCase(TestCase):

    # This method will run before every test
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app
        self.success_counter = 0
        self.total_counter = 0

    # Test that the modelsGet endpoint is working as expected
    def test_modelsGet(self):
        self.total_counter += 1
        response = self.client.get("/models")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(json.loads(response.data), list)
        self.success_counter += 1

    # Test that the upload endpoint is working as expected
    def test_upload(self):
        self.total_counter += 1
        with open('/workspace/flasky/test/test_image.png', 'rb') as img:
            response = self.client.post(
                "/upload",
                data={
                    'file': (img, 'test_image.png'),
                    'model': 'AiModel-sauron-v1.5.keras'
                },
                content_type='multipart/form-data'
            )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('userID', data)
        self.assertIn('OCR', data)
        self.assertIn('model', data)
        self.success_counter += 1

    # This method will run after every test
    def tearDown(self):
        with open('test_results.txt', 'w') as f:
            pass_rate = (self.success_counter / self.total_counter) * 100
            f.write(f'Test pass rate: {pass_rate}%\n')

if __name__ == '__main__':
    unittest.main()