# Use a lightweight GCC image
FROM gcc:latest

# Set working directory
WORKDIR /app

# Copy all files from the backend directory
COPY . .

# Compile the C server
RUN make server

# Expose the port (Render/Railway will provide this via PORT env var)
EXPOSE 8080

# Run the server
CMD ["./server"]
