FROM public.ecr.aws/lambda/nodejs:18

# Copy package.json first for better caching
COPY package.json ${LAMBDA_TASK_ROOT}/

# Install dependencies
RUN npm install
RUN npm run build

# Copy the rest of the application
COPY . ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler
CMD [ "dist/lambda.js", "lambda.handler" ]
