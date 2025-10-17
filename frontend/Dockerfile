# Use uma imagem Node LTS
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

RUN npm install --legacy-peer-deps


# Copia todo o código
COPY . .

# Expõe a porta padrão do Expo
EXPOSE 19000 19001 19002

# Comando para iniciar o Expo
CMD ["npx", "expo", "start", "--tunnel"]

