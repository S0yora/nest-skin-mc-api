# 🪺 Nest Skin MC API

REST API for working with Minecraft skins. The application allows you to retrieve and transform player skins into various formats: 2D and 3D avatars, as well as original skin images.
Uses only Mojang API (for now)


<img width="500" height="1000" alt="skinAnd2DAvatars" src="https://github.com/user-attachments/assets/0b158945-3b42-4820-898c-80d0cf77d0b2" />
<img width="500" height="650" alt="3DAvatars" src="https://github.com/user-attachments/assets/81c64977-9e08-4380-bbe1-945c8266537f" />

## 🚀 Technologies

- **NestJS** - Node.js framework
- **Three.js** - 3D rendering library
- **Canvas** - for 2D rendering
- **GL** - headless-gl
- **Cache** - result caching in memory or Redis
- **Bun** - package manager and runtime
- **Docker** - application containerization

## 📦 Installation

### Requirements

- Node.js 20+ and [Bun](https://bun.com/docs/installation)
- [Dependencies for GL/OpenGL](https://github.com/stackgl/headless-gl?tab=readme-ov-file#system-dependencies)

### Local Installation

1. Clone the repository:

```bash
git clone git@github.com:S0yora/nest-skin-mc-api.git
cd nest-skin-mc-api
```

2. Install dependencies:

```bash
bun install
```

3. Configure environment variables (optional change in `.env` file):

```env
APP_PORT=3001
REDIS_URL=redis://localhost:6379
```

4. Start the application:

```bash
# Development
bun run start

# Production
bun run build
bun run start:prod
```

### Docker

```bash
# Build image
docker build -t nest-skin-mc-api .

# Run container
docker run -p 3001:3001 nest-skin-mc-api
```

## 📖 API Endpoints & Features

### 2D Avatars

| Name  | Description                      | Endpoint                         | Parameters                                                           |
| ----- | -------------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| Face  | Player's face avatar             | `GET /avatar/2d/face/:nickname`  | `size` (8-256, default: 64)<br>`overlay` (true/false, default: true) |
| Bust  | Bust avatar (head and shoulders) | `GET /avatar/2d/bust/:nickname`  | `size` (8-256, default: 64)<br>`overlay` (true/false, default: true) |
| Torso | Torso avatar                     | `GET /avatar/2d/torso/:nickname` | `size` (8-256, default: 64)<br>`overlay` (true/false, default: true) |
| Body  | Full body avatar                 | `GET /avatar/2d/body/:nickname`  | `size` (8-256, default: 64)<br>`overlay` (true/false, default: true) |

**Features:** Size customization (8-256 pixels), overlay toggle (second skin layer)

### 3D Avatars

| Name  | Description                                                | Endpoint                         | Parameters                    |
| ----- | ---------------------------------------------------------- | -------------------------------- | ----------------------------- |
| Stand | Full-height 3D model (classic and slim variants)           | `GET /avatar/3d/stand/:nickname` | `size` (32-512, default: 256) |
| Head  | 3D head model                                              | `GET /avatar/3d/head/:nickname`  | `size` (32-512, default: 256) |
| Chibi | Chibi version of the character (classic and slim variants) | `GET /avatar/3d/chibi/:nickname` | `size` (32-512, default: 256) |

**Features:** Size customization (32-512 pixels), Three.js + gl rendering, FXAA anti-aliasing support

### Skins

**Original Skin** - Retrieving the original player skin image

- **Endpoint:** `GET /skin/:nickname`
- **Parameters:** `nickname` (required) - Minecraft player nickname

**Common Parameters:**

- `nickname` (required) - Minecraft player nickname for all endpoint

## 🏗️ Project Structure

```
src/
├── avatar/
│   ├── 2d/          # 2D avatars
│   │   ├── services/ # Services for generating 2D avatars
│   │   └── ...
│   └── 3d/          # 3D avatars
│       ├── services/ # Services for generating 3D avatars
│       └── ...
├── skin/            # Skin operations
├── common/          # Common utilities and pipes
└── main.ts          # Application entry point

assets/
├── models/          # 3D models (GLTF)
└── shaders/        # Shaders
```

## ⚙️ Configuration

The application uses environment variables (.env) for configuration:

- `APP_PORT` - application port (default: 3001)
- `REDIS_URL` - Redis server host

## 📄 License

Nest Skin MC API is [MIT licensed](./LICENSE).

## 👤 Author

S0yora
