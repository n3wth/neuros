#!/bin/bash

# Script to help refactor Neuros codebase to feature-based architecture
# Usage: ./scripts/refactor-to-features.sh

echo "🚀 Starting feature-based refactoring for Neuros..."

# Create features directory structure
echo "📁 Creating feature module directories..."

mkdir -p features/auth/{components,actions,hooks,types,tests}
mkdir -p features/cards/{components,actions,hooks,types,tests}
mkdir -p features/dashboard/{components,actions,hooks,types,tests}
mkdir -p features/reviews/{components,actions,hooks,types,tests}
mkdir -p features/shared/{ui,utils,constants,types}

# Create index files for each feature
echo "📝 Creating index files..."

cat > features/auth/index.ts << 'EOF'
// Auth feature exports
export * from './components'
export * from './actions/auth.actions'
export * from './hooks/useAuth'
export * from './types/auth.types'
EOF

cat > features/cards/index.ts << 'EOF'
// Cards feature exports
export * from './components'
export * from './actions/cards.actions'
export * from './hooks/useCards'
export * from './types/cards.types'
EOF

cat > features/dashboard/index.ts << 'EOF'
// Dashboard feature exports
export * from './components'
export * from './actions/dashboard.actions'
export * from './hooks/useDashboard'
export * from './types/dashboard.types'
EOF

# Create tsconfig paths for cleaner imports
echo "🔧 Updating tsconfig.json paths..."

cat > tsconfig.paths.json << 'EOF'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["features/*"],
      "@/features/auth": ["features/auth"],
      "@/features/cards": ["features/cards"],
      "@/features/dashboard": ["features/dashboard"],
      "@/features/shared/*": ["features/shared/*"],
      "@/*": ["./*"]
    }
  }
}
EOF

echo "✅ Feature structure created!"
echo ""
echo "Next steps:"
echo "1. Move components to appropriate feature folders"
echo "2. Update imports to use @/features/* paths"
echo "3. Create feature-specific test files"
echo "4. Update CLAUDE.md with new structure"