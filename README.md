# Project IBC

## Tech Stack

### Frontend
- **React 19**
- **TypeScript**
- **Vite**

### Backend
- **Node.js 20**
- **Express 5**

## Quick Start

### Prerequisites
- **Git**
- **Docker Desktop** (have it open)

### Setup
```bash
# 1. Clone repo
git clone https://github.com/tmublueprint/bp-ibc.git

# 2. Create environment file
cp backend/env.example backend/.env (will change this)

# 3. Start
docker compose up --build
```

### Access Points
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:3001/api/health

## Development Workflow

### Daily Development
```bash
# Pull latest changes
git pull
```

### Configuration Updates
```bash
# When Dockerfile, compose.yaml, or package.json changes
git pull
docker compose down
docker compose up --build
```

### Docker Commands
```bash
docker compose up --build    # Start everything
docker compose down          # Stop everything
docker compose restart       # Restart containers
```

## Project Structure

```
bp-ibc/
├── frontend/            # React frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/            # Express backend
│   ├── src/
│   ├── Dockerfile
│   ├── env.example
│   └── package.json
├── compose.yaml        # Docker Compose
├── .gitignore          # Git ignore
└── README.md
```

## Contributing

1. Clone repo
2. Create `.env` file (`cp backend/env.example backend/.env`) (we will change this in the future)
3. Start development (`docker compose up --build`)
4. Make changes (hot reload handles updates)
5. Commit and push

## License

MIT