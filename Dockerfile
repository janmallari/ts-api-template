#
# Development stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
#
# END Development stage


#
# Production stage
FROM development AS production
RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
#
# END Production stage
