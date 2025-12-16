# Use the official Node.js 22 image as a base
FROM node:24-alpine

# Set the working directory in the container
WORKDIR /app

# Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the rest of the application code to the working directory
COPY --chown=nextjs:nodejs .next ./.next
COPY --chown=nextjs:nodejs public ./.next/standalone/public
COPY --chown=nextjs:nodejs .next/static ./.next/standalone/.next/static

# Switch to non-root user
USER nextjs

# Expose the port on which Next.js will run
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js application
CMD ["node", "./.next/standalone/server.js"]
