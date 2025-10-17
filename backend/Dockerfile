FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala todas as dependências, incluindo dev
RUN npm install --legacy-peer-deps --include=dev


# Copia todo o restante do projeto
COPY . .

# Expõe porta (opcional)
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "start:dev"]
