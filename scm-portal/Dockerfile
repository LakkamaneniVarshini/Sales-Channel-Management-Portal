FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_PUBLIC_ENABLE_MOCK_API=true
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
