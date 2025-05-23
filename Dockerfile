FROM public.ecr.aws/lambda/nodejs:18 AS builder

WORKDIR /var/task

COPY package.json ./
RUN npm install

COPY . .

# Final stage - use the same base image
FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}

# Copy from builder stage
COPY --from=builder /var/task ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler
CMD [ "lambda.handler" ]