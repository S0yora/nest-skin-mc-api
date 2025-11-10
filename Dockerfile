FROM node:20-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libgl1-mesa-glx \
    libgl1-mesa-dri \
    libglapi-mesa \
    libosmesa6 \
    mesa-utils \
    python3 \
    python3-pip \
    make \
    g++ \
    pkg-config \
    libx11-dev \
    libxi-dev \
    libxext-dev \
    xvfb \
    x11-xserver-utils \
    xauth \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g bun
COPY . .
RUN bun install

ARG APP_PORT=3001
ENV APP_PORT=${APP_PORT}
ENV DISPLAY=:99
ENV LIBGL_ALWAYS_SOFTWARE=1
EXPOSE ${APP_PORT}
RUN bun run build
CMD ["sh", "-c", "xvfb-run -a -s \"-ac -screen 0 1280x1024x24\" node build/main.js"]