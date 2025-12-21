FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
ENV PORT=3010
EXPOSE 3010
CMD ["npm", "start"]
