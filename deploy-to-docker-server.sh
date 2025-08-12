#!/bin/bash
# Autonomous Neuros Deployment Script
# Deploys the complete autonomous development environment to Docker server

set -e

echo "🚀 Deploying Autonomous Neuros Development System..."

# Configuration
DOCKER_HOST="docker"
DOCKER_USER="${SSH_USER:-oliver}"
PROJECT_DIR="~/neuros-autonomous"
GITHUB_REPO="https://github.com/n3wth/neuros.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we can connect to Docker server
echo "Checking connection to Docker server..."
if ssh -o ConnectTimeout=5 ${DOCKER_HOST} "echo 'Connected'" > /dev/null 2>&1; then
    print_status "Successfully connected to Docker server"
else
    print_error "Cannot connect to Docker server. Please check SSH configuration."
    echo "Make sure you have SSH access configured: ssh ${DOCKER_HOST}"
    exit 1
fi

# Create environment file
echo "Creating environment configuration..."
cat > .env.production << EOF
# Neuros Production Environment
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# OpenAI
OPENAI_API_KEY=${OPENAI_API_KEY}

# Anthropic
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}

# GitHub
GITHUB_TOKEN=${GITHUB_TOKEN}
GITHUB_RUNNER_TOKEN=${GITHUB_RUNNER_TOKEN}

# Database
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-neuros_secure_pass_2024}

# Monitoring
GRAFANA_PASSWORD=${GRAFANA_PASSWORD:-admin_secure_2024}

# Auto-deployment
AUTO_MERGE=true
AUTO_FIX_ISSUES=true
AUTO_IMPLEMENT_FEATURES=true
AUTO_IMPROVE_UI=true
AUTO_RUN_TESTS=true
EOF

print_status "Environment configuration created"

# Copy files to Docker server
echo "Copying files to Docker server..."
ssh ${DOCKER_HOST} "mkdir -p ${PROJECT_DIR}"

# Copy docker-compose and related files
scp docker-compose.production.yml ${DOCKER_HOST}:${PROJECT_DIR}/
scp Dockerfile.production ${DOCKER_HOST}:${PROJECT_DIR}/
scp .env.production ${DOCKER_HOST}:${PROJECT_DIR}/.env
scp -r docker/ ${DOCKER_HOST}:${PROJECT_DIR}/

print_status "Files copied to Docker server"

# Deploy on Docker server
echo "Deploying on Docker server..."
ssh ${DOCKER_HOST} << 'ENDSSH'
set -e

cd ~/neuros-autonomous

# Clone or update repository
if [ ! -d ".git" ]; then
    echo "Cloning repository..."
    git clone https://github.com/n3wth/neuros.git .
else
    echo "Updating repository..."
    git pull origin main
fi

# Create necessary directories
mkdir -p docker/agents/logs
mkdir -p docker/agents/data
mkdir -p docker/reports
mkdir -p docker/monitoring/dashboards
mkdir -p test-results
mkdir -p runner-data
mkdir -p letsencrypt

# Create monitoring configuration
cat > docker/monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'neuros-app'
    static_configs:
      - targets: ['neuros-app:3000']
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
EOF

# Build and start services
echo "Building Docker images..."
docker-compose -f docker-compose.production.yml build

echo "Starting services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Check service health
docker-compose -f docker-compose.production.yml ps

# Initialize database for AI agents
docker exec -it postgres psql -U neuros -d neuros_ai -c "
CREATE TABLE IF NOT EXISTS ai_tasks (
    id SERIAL PRIMARY KEY,
    task_type VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);"

echo "✅ Deployment complete!"
ENDSSH

print_status "Services deployed successfully"

# Verify deployment
echo "Verifying deployment..."
sleep 10

# Check if main app is accessible
if curl -f -s -o /dev/null -w "%{http_code}" https://neuros.newth.ai | grep -q "200\|301\|302"; then
    print_status "Main application is accessible at https://neuros.newth.ai"
else
    print_warning "Main application may not be fully initialized yet"
fi

# Check monitoring dashboard
if ssh ${DOCKER_HOST} "docker exec grafana curl -f http://localhost:3000/api/health" > /dev/null 2>&1; then
    print_status "Monitoring dashboard is running"
else
    print_warning "Monitoring dashboard is still initializing"
fi

# Display service status
echo ""
echo "==================================="
echo "🎉 Autonomous Neuros Deployment Complete!"
echo "==================================="
echo ""
echo "Services deployed:"
echo "  • Main App: https://neuros.newth.ai"
echo "  • Monitoring: http://${DOCKER_HOST}:3001 (Grafana)"
echo "  • Code Quality: http://${DOCKER_HOST}:9000 (SonarQube)"
echo "  • Metrics: http://${DOCKER_HOST}:9090 (Prometheus)"
echo ""
echo "AI Agents running:"
echo "  • Product Manager - Analyzing user feedback and creating issues"
echo "  • Developer - Implementing features and fixes autonomously"
echo "  • QA Engineer - Running tests and ensuring quality"
echo "  • Designer - Improving UI/UX continuously"
echo ""
echo "The system will now:"
echo "  ✓ Automatically fix bugs and implement features"
echo "  ✓ Run tests on every change"
echo "  ✓ Deploy successful changes to production"
echo "  ✓ Monitor performance and self-heal"
echo "  ✓ Improve continuously, even while you sleep"
echo ""
echo "To view logs:"
echo "  ssh ${DOCKER_USER}@${DOCKER_HOST} 'docker-compose -f ${PROJECT_DIR}/docker-compose.production.yml logs -f ai-developer'"
echo ""
echo "To stop services:"
echo "  ssh ${DOCKER_USER}@${DOCKER_HOST} 'docker-compose -f ${PROJECT_DIR}/docker-compose.production.yml down'"
echo ""

# Create local monitoring script
cat > monitor-autonomous-system.sh << 'EOF'
#!/bin/bash
# Monitor the autonomous development system

DOCKER_HOST="docker"
DOCKER_USER="${SSH_USER:-oliver}"

echo "📊 Monitoring Autonomous Neuros System..."
echo ""

# Check AI agent status
echo "AI Agent Status:"
ssh ${DOCKER_USER}@${DOCKER_HOST} "docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -E 'ai-|github-runner'"

echo ""
echo "Recent AI Activity:"
ssh ${DOCKER_USER}@${DOCKER_HOST} "docker logs --tail 20 ai-developer 2>&1 | grep -E 'INFO|SUCCESS|PR created'"

echo ""
echo "GitHub Issues Created by AI:"
curl -s "https://api.github.com/repos/n3wth/neuros/issues?creator=ai-developer&state=all" | jq -r '.[] | "  • \(.title) (#\(.number))"' | head -5

echo ""
echo "System Health:"
curl -s https://neuros.newth.ai/api/health | jq '.'
EOF

chmod +x monitor-autonomous-system.sh

print_status "Created monitoring script: ./monitor-autonomous-system.sh"
print_status "Deployment complete! Your autonomous development system is now running."