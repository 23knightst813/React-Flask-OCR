FROM debian:bookworm-20240612

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y python3 python3-pip --fix-missing
RUN apt-get install -y libsm6 libxext6 --fix-missing

WORKDIR /app

COPY . .

RUN python3 -m pip install -r requirements.txt --break-system-packages

EXPOSE 5000

CMD [ "python3", "./main.py" ]
