# Rotas Seguras (Safe Routes)

> Uma plataforma de crowdsourcing para monitoramento de segurança urbana e rotas inteligentes.

## Sobre o Projeto
O **Rotas Seguras** é uma aplicação desenvolvida como parte da disciplina de Laboratório de Desenvolvimento de Software na **EACH-USP**. O objetivo é mitigar a insegurança urbana permitindo que usuários relatem incidentes (furtos, assédio, iluminação precária) e consultem rotas mais seguras baseadas em dados colaborativos.

## Tecnologias & Arquitetura (Back-end Focus)

O sistema foi construído seguindo princípios de **Clean Architecture** e **Modularidade**.

* **Back-end:** [Nest.js](https://nestjs.com/) (Framework Node.js progressivo)
* **Linguagem:** TypeScript
* **Banco de Dados & Auth:** Firebase (Firestore & Authentication)
* **Mobile:** React Native + Expo
* **Design Patterns:** Dependency Injection, Repository Pattern (via Firebase Service), DTOs para validação.

## Funcionalidades Principais

* **Autenticação Segura:** Login e registro integrados via Firebase Auth.
* **Gestão de Ocorrências:** API para criação (Create) e leitura (Read) de incidentes geolocalizados.
* **Categorização de Risco:** Classificação de incidentes (Furto, Assédio, Saúde, Infraestrutura).
* **Visualização de Dados:** Endpoints otimizados para plotagem de dados em mapas interativos.

