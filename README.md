# Kraken Plugins Repository 🐙

> **Repositório e Catálogo Oficial de Plugins Comunitários e Oficiais para o Kraken Admin Tool**, pronto para ser hospedado no **GitHub Pages** como site estático.

---

## 🌟 Recursos Principais

1. **Catálogo Oficial (`index.json`)**:
   - Serve a especificação padrão `index.json` consumida nativamente pela aba **Plugins & Store** do Kraken Admin Tool.
   - Permite aos administradores do Kraken adicionar a URL do catálogo diretamente nas configurações do sistema.

2. **Interface Moderna (Next.js 15 + Tailwind CSS)**:
   - Visual escuro profissional alinhado à identidade visual do Kraken.
   - Filtros por nome, ID, autor e tipo de runtime (`wasm`, `none`, `container`).
   - Modal com documentação detalhada (README renderizado), permissões requeridas e links de download.
   - Botão de 1 clique para copiar o link de instalação rápida para o Kraken.

3. **Submissão Automatizada de Plugins via GitHub**:
   - Um novo colaborador informa apenas a URL do repositório GitHub do seu plugin (ex: `https://github.com/usuario/meu-plugin`).
   - O sistema inspeciona e lê em tempo real:
     - O arquivo `plugin.json` da raiz (para obter ID, nome, versão, autor, licença, permissões, etc.).
     - O `README.md` com a documentação completa.
     - As releases do repositório no GitHub para obter o link direto de download do arquivo `.zip` ou `.tar.gz`.
   - Adiciona o plugin na base de dados do catálogo.

4. **Autenticação com GitHub (PAT)**:
   - Login seguro utilizando Personal Access Token (PAT) diretamente contra a API do GitHub, sem necessidade de servidores intermediários.
   - Dados de sessão armazenados localmente no navegador do usuário.

5. **CI/CD Automatizado para GitHub Pages e Releases**:
   - Workflow `.github/workflows/deploy.yml`: Compila e publica automaticamente o site estático no GitHub Pages a cada push na branch principal.
   - Workflow `.github/workflows/release.yml`: Publica releases automáticas com os arquivos do catálogo (`.zip` e `.tar.gz`) sempre que uma tag de versão for criada.

6. **Script de 1 Comando para Criar Nova Versão**:
   - Script `./scripts/release.sh v1.0.1` que atualiza a versão no `package.json`, carimba o timestamp no `index.json`, compila o site e cria a tag no Git.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ (recomendado Node.js 22)
- npm

### Passos
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# Acesse no navegador: http://localhost:3000
```

---

## 📦 Como Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex: `kraken-plugins-repository`).
2. Conecte o repositório local e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Kraken Plugins Repository"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/kraken-plugins-repository.git
   git push -u origin main
   ```
3. No GitHub, acesse **Settings > Pages**:
   - Em **Build and deployment > Source**, selecione: **GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` será executado automaticamente e publicará o site na URL:
   `https://SEU_USUARIO.github.io/kraken-plugins-repository/`

---

## 🏷️ Criando uma Nova Versão da Página

Para gerar uma nova versão da página e do catálogo com apenas 1 comando:

```bash
# Executar o script de release (especificando a versão):
./scripts/release.sh v1.0.1

# Em seguida, envie para o GitHub com tags:
git push origin main --tags
```

O GitHub Actions compilará a nova versão, publicará a atualização no GitHub Pages e criará uma Release correspondente com os arquivos empacotados.
