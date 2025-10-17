# criando-rotas - Aplicativo de Segurança Urbana

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red)](https://nestjs.com/)
[![React Native](https://img.shields.io/badge/React_Native-0.72-blue)](https://reactnative.dev/)
[![Docker](https://img.shields.io/badge/Docker-20.10-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Descrição

**SafeRoutes** é um aplicativo móvel que auxilia usuários a se deslocarem com mais segurança em ambientes urbanos, fornecendo:

- Rotas seguras com base em dados de usuários e alertas de risco.
- Avaliação de trajetos e feedback em tempo real.
- Ferramentas de proteção e autenticação para usuários.
- Interface intuitiva e cross-platform (Android/iOS).

O projeto segue a filosofia **MVP1 focado em segurança e funcionalidade essencial**, com MVP2 prevendo integração social e comunidade de usuários.

---

## Tecnologias

| Camada | Ferramenta / Framework | Observações |
|--------|----------------------|-------------|
| Backend | NestJS | APIs RESTful |
| Frontend | React Native + Expo | Mobile cross-platform |
| Banco de Dados | Firebase Firestore | Persistência de dados de rotas e usuários |
| Contêineres | Docker + Docker Compose | Modularização e deploy |
| Versionamento | Git + GitHub | Controle de versão |
| Extensões VS Code | React Native Tools, Prettier, ES7+ Snippets | Auxilia produtividade e padronização |

---

## Funcionalidades

### MVP1 (Essenciais)

- Criação de rotas com origem e destino.
- Visualização de rotas existentes com métricas de segurança.
- Avaliação de rotas (nota e comentários).
- Alertas de segurança e botão de emergência.
- Autenticação de usuários (login seguro).

### MVP2 (Secundárias / Futuras)

- Sistema de comunidade: interligação de usuários via rotas.  
- Personalização de segurança por perfil (ex: mulheres, grupos vulneráveis).  
- Notificações em tempo real e sugestões de trajetos.  

---

## Pré-requisitos

- Node.js ≥ 18.x  
- npm ≥ 9.x (ou Yarn ≥ 1.22)  
- Docker Desktop com WSL2 ativo (Windows)  
- Git ≥ 2.x  
- Expo CLI ≥ 6.x  
- NestJS CLI ≥ 10.x  

---

## Instalação e Configuração Inicial

### 1. Clonar o projeto

```bash
git clone https://github.com/usuario/safe-routes.git
cd safe-routes
```

### 2. Instalar dependências

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 3. Construir e subir containers

```bash
docker compose build
docker compose up
```



