# Rotas Seguras (Safe Routes)

O **Rotas Seguras** é uma plataforma de crowdsourcing focada em segurança urbana. O sistema coleta dados de incidentes reportados pela comunidade para calcular e sugerir trajetos mais seguros em tempo real.

O projeto foi desenvolvido no contexto acadêmico da **EACH-USP**, utilizando uma arquitetura voltada para escalabilidade e processamento de dados geoespaciais.

## Visão Geral da Arquitetura

O sistema opera sobre uma arquitetura híbrida, utilizando serviços gerenciados para persistência e containers para a lógica de negócio.

* **Backend:** NestJS (Node.js)
* **Banco de Dados:** Google Firestore (NoSQL)
* **Autenticação:** Firebase Authentication
* **Infraestrutura:** Docker (Ambiente de Desenvolvimento) e Google Cloud Run (Produção/Conceito)
* **Mobile:** React Native (Expo)

## Destaques Técnicos (Backend)

### 1. Algoritmo de Índice de Segurança
O núcleo da aplicação é o "Seguranca Service". Este serviço implementa um algoritmo de ponderação que transforma dados subjetivos (relatos de usuários) em uma métrica quantitativa de risco para regiões específicas. O cálculo considera:
* Tipologia do incidente (Furto, Iluminação, Assédio, etc.).
* Frequência de reportes em um raio geoespacial.
* Decaimento temporal da relevância do alerta.

### 2. Estratégia de Dados
Utilização do Firestore para armazenamento de documentos flexíveis, permitindo a ingestão rápida de dados não estruturados provenientes dos relatos dos usuários. A modelagem foi otimizada para consultas geoespaciais, reduzindo a latência na plotagem de mapas de calor.

### 3. Modularidade e Segurança
A API foi construída seguindo princípios de Clean Architecture dentro do ecossistema NestJS, garantindo o desacoplamento entre as camadas de controle, serviço e repositório.
* **Validação de Entrada:** Pipelines de validação rigorosos para garantir a integridade dos payloads recebidos.
* **Injeção de Dependência:** Utilizada para facilitar testes unitários e manutenção do código.


---
**Status do Projeto:** Em desenvolvimento.
