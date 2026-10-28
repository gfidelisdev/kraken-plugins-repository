#!/usr/bin/env bash
# ==============================================================================
# Kraken Plugins Repository — One-Click Release Script
# Usage: ./scripts/release.sh [version] (e.g. ./scripts/release.sh v1.0.1)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

VERSION="$1"

if [ -z "$VERSION" ]; then
  # Read version from package.json or prompt
  CURRENT_VER=$(node -p "require('./package.json').version")
  echo "Versão atual no package.json: $CURRENT_VER"
  read -p "Digite a nova versão da release (ex: v1.0.1): " VERSION
fi

# Ensure starts with 'v'
if [[ ! "$VERSION" =~ ^v ]]; then
  VERSION="v$VERSION"
fi

CLEAN_VER="${VERSION#v}"

echo ""
echo "🚀 Iniciando build e preparação da release $VERSION..."
echo ""

# 1. Update package.json version
node -e "
const pkg = require('./package.json');
pkg.version = '$CLEAN_VER';
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# 2. Update updated_at timestamp in public/index.json
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
node -e "
const idx = require('./public/index.json');
idx.updated_at = '$TIMESTAMP';
require('fs').writeFileSync('./public/index.json', JSON.stringify(idx, null, 2) + '\n');
"

# 3. Clean and build static distribution
echo "📦 Compilando aplicação Next.js para exportação estática (out/)..."
npm run build

echo ""
echo "✅ Build estático finalizado com sucesso em ./out/"
echo "📄 Catálogo oficial gerado em: ./public/index.json e ./out/index.json"
echo ""

# 4. Git commit and tag if inside a git repo
if [ -d .git ]; then
  echo "🔖 Criando tag git para release automática no GitHub..."
  git add package.json public/index.json
  git commit -m "chore(release): $VERSION [skip ci]" || true
  git tag -a "$VERSION" -m "Release $VERSION"
  echo ""
  echo "🎉 Tag $VERSION criada localmente!"
  echo "Para enviar a release e disparar o GitHub Actions automaticamente, execute:"
  echo ""
  echo "   git push origin main --tags"
  echo ""
else
  echo "ℹ️ Diretório .git não inicializado. Para versionar no GitHub:"
  echo "   git init"
  echo "   git add ."
  echo "   git commit -m 'Initial commit: Kraken Plugins Repository'"
  echo "   git tag -a '$VERSION' -m 'Release $VERSION'"
  echo "   git remote add origin https://github.com/SEU_USUARIO/kraken-plugins-repository.git"
  echo "   git push -u origin main --tags"
fi

echo ""
echo "✨ Concluído com sucesso!"
