# Use the official Node.js image as the base image
FROM ubuntu:latest

# Downloading Node and NPM
ENV NODE_VERSION=16.13.0
RUN apt-get update && apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install Python and pip3
RUN apt-get update && apt-get install -y python3 python3-pip

# Clean up package cache to free up space
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Update the package index
RUN apt-get install 

# Install additional dependencies for Qt
#RUN apt-get install -y libx11-xcb1 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-render-util0 libxcb-xinerama0 libxcb-shm0 \
#    libbsd0 libmd0 libx11-6 libx11-data libxau6 libxcb-render0 libxcb-util1 libxcb1 libxdmcp6

# Set the environment variable for QT_DEBUG_PLUGINS
ENV QT_DEBUG_PLUGINS=1

# Install additional Python packages
RUN pip3 install tensorflow opencv-python imutils

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application. Ignore "Build optimization failed"
RUN /bin/sh -c 'npm run build || true'

# Expose the port that your Next.js application listens on
ENV PORT 3000
EXPOSE 3000

# Define the command to run your Next.js application in development mode
CMD ["npm", "run", "dev"]
 