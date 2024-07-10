# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

################################################################################
# Pick a base image to serve as the foundation for the other build stages in
# this file.
#
# For illustrative purposes, the following FROM command
# is using the alpine image (see https://hub.docker.com/_/alpine).
# By specifying the "latest" tag, it will also use whatever happens to be the
# most recent version of that image when you build your Dockerfile.
# If reproducability is important, consider using a versioned tag
# (e.g., alpine:3.17.2) or SHA (e.g., alpine@sha256:c41ab5c992deb4fe7e5da09f67a8804a46bd0592bfdf0b1847dde0e0889d2bff).
FROM debian:bookworm-20240612 AS base
# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive
# Configure apt and install packages
RUN apt-get update -y && apt-get upgrade -y

################################################################################
# Create a final stage for running your application.
#
# The following commands copy the output from the "build" stage above and tell
# the container runtime to execute it when the image is run. Ideally this stage
# contains the minimal runtime dependencies for the application as to produce
# the smallest image possible. This often means using a different and smaller
# image than the one used for building the application, but for illustrative
# purposes the "base" image is used here.
FROM base AS final

RUN apt-get install -y python3 python3-pip --fix-missing
WORKDIR /workspace/flasky

# RUN pip3 install -r requirements.txt --break-system-packages
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=/workspace/flasky/requirements.txt \
    python3 -m pip install -r /workspace/flasky/requirements.txt --break-system-packages

COPY . /workspace/flasky
COPY AIy/ /workspace/AIy

WORKDIR /workspace
# COPY post_run.sh .
# RUN chmod +x post_run.sh

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
# ARG UID=10001
# RUN adduser \
#     --disabled-password \
#     --gecos "" \
#     --home "/nonexistent" \
#     --shell "/sbin/nologin" \
#     --no-create-home \
#     --uid "${UID}" \
#     appuser
# USER appuser

# EXPOSE 5000
# EXPOSE 5173

RUN apt-get install -y libsm6 libxext6 --fix-missing

# What the container should run when it is started.
ENTRYPOINT [ "python3 /workspace/flasky/main.py" ]
