FROM public.ecr.aws/lambda/nodejs:18

# Copy package.json first for better caching
COPY package.json ${LAMBDA_TASK_ROOT}/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . ${LAMBDA_TASK_ROOT}/

# Build TypeScript AFTER source files are copied
RUN npm run build

# Set the CMD to your handler
CMD [ "dist/lambda.handler" ]
