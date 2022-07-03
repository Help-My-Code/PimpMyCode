
# Stage 1
FROM node:14-alpine as build-step

ARG BACKEND

ENV \
BACKEND=${BACKEND}


WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Stage 2
FROM nginx:alpine
COPY --from=build-step /app/dist/PimpMyCode /usr/share/nginx/html
