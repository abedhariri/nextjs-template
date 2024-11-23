# Use the official Node.js 18 image as a base
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY .next ./.next
COPY public ./.next/standalone/public
COPY .next/static ./.next/standalone/.next/static

# Expose the port on which Next.js will run
EXPOSE 3000

# Start the Next.js application
CMD ["node", "./.next/standalone/server.js"]
