# --- Builder Stage ---
FROM golang:1.21-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to download dependencies first
# This leverages Docker's layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire source code
COPY . .

# Build the Go app
# CGO_ENABLED=0 is used to build a statically linked binary
# GOOS=linux specifies the target OS
RUN CGO_ENABLED=0 GOOS=linux go build -o ./api ./cmd/api

# --- Final Stage ---
FROM alpine:latest

# Set the working directory for the final image
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/api .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the application
CMD ["./api"]
