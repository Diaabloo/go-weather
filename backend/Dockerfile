# Builder
FROM golang:1.25.1-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/app

# Image finale (production)
FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/server /app/server

ENV PORT=8080

EXPOSE 8080

USER nobody:nogroup

ENTRYPOINT ["/app/server"]

