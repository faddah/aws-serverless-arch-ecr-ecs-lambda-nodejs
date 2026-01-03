# AWS Lambda + ECR + Node.js/Express TypeScript Example

|                                     |                                     |
|:-----------------------------------:|:-----------------------------------:|
| ![AWS Lambda Functions Logo Graphic](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb60Mv2e2TTbw4B9W1njsiH8IN1x49jkj8zA&s) | ![Docker Logo Graphic](https://www.clipartmax.com/png/small/124-1243662_docker-whale-logo-docker-png-logo.png) |

This is an example project demonstrating a **Node.js/Express.js server** written in **TypeScript**, packaged as a **Docker container**, deployed to **AWS Elastic Container Registry (ECR)**, and executed via **AWS Lambda Functions**.

## 📋 Project Overview

**This project showcases:**

- ✅ A simple Express.js web server built with TypeScript
- ✅ Docker containerization for AWS Lambda
- ✅ Integration with AWS Lambda using `serverless-http`
- ✅ Deployment to AWS ECR and Lambda
- ✅ Serving HTML content with CSS styling

## 🏗️ Architecture

```
Client Request → API Gateway → AWS Lambda → Docker Container (ECR) → Express App → HTML Response
```

The Express.js application is wrapped with `serverless-http` to handle Lambda events and packaged as a Docker container image hosted on AWS ECR.

## 📦 Project Structure

```
.
├── src/
│   ├── app.ts          # Express application with routes
│   ├── app.css         # Styling for the web page
│   ├── index.ts        # Local development server
│   └── lambda.ts       # Lambda handler with serverless-http wrapper
├── dist/               # Compiled JavaScript output (generated)
├── Dockerfile          # Docker configuration for Lambda
├── package.json        # Node.js dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── template.yaml       # AWS SAM template (optional)
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Docker Desktop**
- **AWS CLI** configured with credentials (`aws configure`)
- **AWS Account** with permissions for:
  - ECR (Elastic Container Registry)
  - Lambda
  - IAM (for Lambda execution role)

## 🚀 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server (with hot reload)

```bash
npm run dev
```

Visit `http://localhost:3300` in your browser.

### 3. Build TypeScript

```bash
npm run build
```

### 4. Run Production Server (compiled)

```bash
npm start
```

## 🐳 Building and Deploying to AWS

### Step 1: Configure AWS CLI Credentials

Before you can create AWS resources, ensure you're logged in to AWS CLI with your credentials:

```bash
aws configure
```

**You'll be prompted to enter:**

- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key
- **Default region name**: Your preferred region (e.g., `us-west-2`)
- **Default output format**: `json` (recommended)

**Verify your credentials:**
```bash
aws sts get-caller-identity
```

This should display your AWS account ID, user ID, and ARN.

### Step 2: Create an ECR Repository

Now, create a repository in AWS ECR to store your Docker image:

```bash
aws ecr create-repository \
  --repository-name your-app-name \
  --region your-region
```

**Example:**
```bash
aws ecr create-repository \
  --repository-name aws-lambda-express-app \
  --region us-west-2
```

Note the `repositoryUri` from the output (e.g., `123456789012.dkr.ecr.us-west-2.amazonaws.com/aws-lambda-express-app`).

### Step 3: Authenticate Docker with ECR

```bash
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
```

**Example:**
```bash
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com
```

### Step 4: Build the Docker Image

Build the image for Linux/AMD64 architecture (required for Lambda):

```bash
docker buildx build --platform linux/amd64 --provenance=false --sbom=false -t your-image-name:tag .
```

**Example:**
```bash
docker buildx build --platform linux/amd64 --provenance=false --sbom=false -t aws-lambda-express-app:v1.0.0 .
```

**Note for Apple Silicon (M1/M2/M3) Mac users:** The `--platform linux/amd64` flag is required since Lambda runs on x86_64 architecture.

### Step 5: Tag the Docker Image

Tag your image with the ECR repository URI:

```bash
docker tag your-image-name:tag your-account-id.dkr.ecr.your-region.amazonaws.com/your-repo-name:tag
```

**Example:**
```bash
docker tag aws-lambda-express-app:v1.0.0 123456789012.dkr.ecr.us-west-2.amazonaws.com/aws-lambda-express-app:v1.0.0
```

### Step 6: Push the Image to ECR

```bash
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/your-repo-name:tag
```

**Example:**
```bash
docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/aws-lambda-express-app:v1.0.0
```

## ⚡ Setting Up AWS Lambda Function

### Step 7: Create a Lambda Execution Role

If you don't already have one, create an IAM role for Lambda:

1. Go to **IAM Console** → **Roles** → **Create Role**
2. Select **AWS Service** → **Lambda**
3. Attach the policy: `AWSLambdaBasicExecutionRole`
4. Name it (e.g., `lambda-execution-role`)
5. Note the Role ARN (e.g., `arn:aws:iam::123456789012:role/lambda-execution-role`)

### Step 8: Create Lambda Function (AWS Console)

1. Go to **AWS Lambda Console**
2. Click **Create function**
3. Select **Container image**
4. Configure:
   - **Function name**: `your-function-name` (e.g., `express-app-lambda`)
   - **Container image URI**: Paste your ECR image URI from Step 6
     - Example: `123456789012.dkr.ecr.us-west-2.amazonaws.com/aws-lambda-express-app:v1.0.0`
   - **Execution role**: Select the role from Step 7
5. Click **Create function**

### Step 8 (Alternative): Create Lambda Function (AWS CLI)

```bash
aws lambda create-function \
  --function-name your-function-name \
  --package-type Image \
  --code ImageUri=your-account-id.dkr.ecr.your-region.amazonaws.com/your-repo-name:tag \
  --role arn:aws:iam::your-account-id:role/your-lambda-role \
  --region your-region \
  --timeout 30 \
  --memory-size 512
```

**Example:**
```bash
aws lambda create-function \
  --function-name express-app-lambda \
  --package-type Image \
  --code ImageUri=123456789012.dkr.ecr.us-west-2.amazonaws.com/aws-lambda-express-app:v1.0.0 \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --region us-west-2 \
  --timeout 30 \
  --memory-size 512
```

### Step 9: Configure Function URL (Public Access)

To access your Lambda function via HTTP:

1. In the Lambda Console, select your function
2. Go to **Configuration** → **Function URL**
3. Click **Create function URL**
4. Auth type: **NONE** (for public access)
5. Click **Save**
6. Copy the **Function URL** (e.g., `https://abc123xyz.lambda-url.us-west-2.on.aws/`)

**Via CLI:**
```bash
aws lambda create-function-url-config \
  --function-name your-function-name \
  --auth-type NONE \
  --region your-region
```

### Step 10: Add Resource-based Policy (Public Access)

Allow public invocation:

```bash
aws lambda add-permission \
  --function-name your-function-name \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region your-region
```

## 🧪 Testing the Lambda Function

1. **Copy the Function URL** from Step 8
2. **Open in browser**: Navigate to the Function URL
3. **You should see**: The HTML page with "Hello World!" and the image

**Example:**
```
https://abc123xyz.lambda-url.us-west-2.on.aws/
```

## 🔄 Updating the Lambda Function

When you make code changes and want to deploy a new version:

### 1. Build and Push New Image

```bash
# Build with a new tag
docker buildx build --platform linux/amd64 --provenance=false --sbom=false -t your-image-name:v1.0.1 .

# Tag for ECR
docker tag your-image-name:v1.0.1 your-account-id.dkr.ecr.your-region.amazonaws.com/your-repo-name:v1.0.1

# Push to ECR
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/your-repo-name:v1.0.1
```

### 2. Update Lambda Function

```bash
aws lambda update-function-code \
  --function-name your-function-name \
  --image-uri your-account-id.dkr.ecr.your-region.amazonaws.com/your-repo-name:v1.0.1 \
  --region your-region
```

### 3. Wait and Test

Wait 30-60 seconds for Lambda to pull and deploy the new image, then test your function URL.

## 📚 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run development server with hot reload |
| `npm start` | Run compiled production server locally |
| `npm run build` | Compile TypeScript to JavaScript |

## 🛠️ Technology Stack

- **Runtime**: Node.js 18
- **Language**: TypeScript 5.x
- **Framework**: Express.js 5.x
- **Serverless**: serverless-http
- **Container**: Docker (AWS Lambda base image)
- **Cloud**: AWS Lambda + ECR

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3300` | Port for local development server |

Create a `.env` file for local development (not used in Lambda):

```env
PORT=3300
```

## 🔒 Security Considerations

- This example uses **public function URLs** for demonstration
- For production:
  - Use **IAM authentication** or **API Gateway** with proper authentication
  - Implement **CORS** policies appropriately
  - Use **AWS WAF** for additional protection
  - Store secrets in **AWS Secrets Manager**
  - Enable **CloudWatch Logs** for monitoring

## 🐛 Troubleshooting

### 502 Bad Gateway Error

- **Cause**: Handler configuration issue in Dockerfile **and** template.yaml.
- **Fix**: Ensure Dockerfile `CMD` is `["dist/lambda.handler"]`; ensure template.yaml `Command` is also `["dist/lambda.handler"]`.

### Cannot find module errors

- **Cause**: Missing dependencies or incorrect paths
- **Fix**: Run `npm install` and rebuild with `npm run build`

### Docker build fails on Apple Silicon

- **Cause**: Architecture mismatch
- **Fix**: Use `--platform linux/amd64` flag in docker build command

### Lambda timeout

- **Cause**: Default timeout (3s) too short
- **Fix**: Increase timeout in Lambda configuration (recommended: 30s)

## 📄 License

ISC

## 👤 Authors

Original project by Prince Onukwili
Repository: https://github.com/onukwilip/ci-cd-tutorial.git
From his Free Code Camp article: [The Serverless Architecture Handbook: How to Publish a Node Js Docker Image to AWS ECR and Deploy the Container to AWS Lambda](https://www.freecodecamp.org/news/serverless-architecture-with-aws-lambda/).

Updated version by [Faddah Wolf](https://github.com/faddah)  
Repository: https://github.com/faddah/aws-serverless-arch-ecr-ecs-lambda-nodejs

---

**Note**: This is an educational example project. For production use, implement proper security, error handling, monitoring, and CI/CD practices.
