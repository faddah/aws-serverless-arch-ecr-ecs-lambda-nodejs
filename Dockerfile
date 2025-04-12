FROM node:18-slim AS builder

WORKDIR /app

COPY package.json .

RUN npm i -f

COPY . .

USER root

FROM amazon/aws-lambda-nodejs

ENV PORT=5000

COPY --from=builder /app/ ${LAMBDA_TASK_ROOT}
COPY --from=builder /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY --from=builder /app/package.json ${LAMBDA_TASK_ROOT}
COPY --from=builder /app/package-lock.json ${LAMBDA_TASK_ROOT}

EXPOSE 5000

CMD [ "lambda.handler" ]

