# imagem base
FROM node:26-alpine

# diretório base
WORKDIR /app

# cópia de arquivos base
COPY api-shared-config.json .

# cópia de dependencias da pasta de utilidades
COPY back-end/utils/package.json /app/back-end/utils/package.json

# instalação em utilidade
RUN npm --prefix back-end/utils install

# copia do resto dos arquivos em utils
COPY back-end/utils /app/back-end/utils

# copia de dependencias principais
COPY back-end/user/package.json /app/back-end/user/package.json

# instalação de dependencias
RUN npm --prefix back-end/user install

# copia do resto dos arquivos principais
COPY back-end/user /app/back-end/user

EXPOSE 3002

CMD ["npm", "--prefix","back-end/user","start"]
