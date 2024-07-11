#!/bin/bash

# Run npm run dev in the /workspace/reacty folder
cd /workspace/reacty
npm run dev &

# Run python main.py in the /workspace/flasky folder
cd /workspace/flasky
python3 main.py
