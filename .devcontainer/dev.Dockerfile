FROM debian:bookworm-20240612

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update -y && apt-get upgrade -y

# Install python and vite
RUN apt-get install -y python3 python3-pip npm --fix-missing