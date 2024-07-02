# Infrastructure setup
AWS CLI 
```shell
# Check if aws cli is installed
aws --version
# Configure aws cli
aws configure
```
AWS CDK
```shell
# Install aws cdk
npm install -g aws-cdk
# Create an empty directory for infrastructure
mkdir infrastructure-name
cd infrastructure-name
# Installs the cdk typescript project
cdk init app --language typescript 
```
- `./lib` - initializes code for creating cloud infrastrucutre
- `./bin` - executes functions from `./lib` directory
- `./test` - test environment
- `./cdk.json` - don\`t touch 
- `./jest.config.js` - starts tests (defines test suite)
- `./package.json` - dependecies

Update CDK Windows
```shell
npm run build | cdk synth
```
Update CDK iOS
```shell
npm run build && cdk synth
```
**CDK needs to be updated each time a deployment has to be made.**
```shell
# Check for outdated files
npm outdated
# Update npm
npm update
# aws cdk global update
npm install -g aws-cdk
```
Infrastructure has to be bootstraped and uploaded to shared S3 bucket
```shell
cdk bootstrap
# For defining a specific profile
cdk bootstrap --profile default
```
Synthesize and deploy the stack
```shell
# StackName is the string id passed trough *-stack.ts constructor
cdk synth StackName
cdk deploy StackName
```
Destroying the stack
```shell
cdk destroy StackName
```
## Constructs
Lowest level logical separation. (concrete AWS resources)
- **L1** - CFN Resource - lowest level constructs, allows control over every setting, applies to single AWS resource
- **L2** - Curated - medium level constructs, applies to single AWS resource, sensible defaults, security best practices, helper methods
- **L3** - Patterns - high level constructs, multiple resources, solves a particular architectural problem (pre-made architectures)

## Stacks 
Containers of related constructs. Organizing code into more intuitive way. Comunication between stacks is possible. 
## App
Collection of stacks. One app per project.
# Best practices
CDK apps should be organised into logical units:
- infrastructure (S3, RDS, VPC)
- runtime code (Lambda)
- configuration code
- optional pipeline for automated deployment
Stacks define the deployment model of these logical units.
[official best practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)

# Lambda layer
```shell
tar -xf ffmpeg-git-arm64-static.tar.xz
mv ffmpeg-git-20240524-arm64-static/ bin
zip -r ffmpeg bin
```

# Links
- [AWS CDK Crash Course for Beginners](https://www.youtube.com/watch?v=D4Asp5g4fp8)
- [Open source library of constructs](https://constructs.dev/)
- [AWS Reference Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
- [Cognito playlist](https://www.youtube.com/watch?v=oFSU6rhFETk&list=PL9nWRykSBSFhOPUJaA4uaKfroosVbUZX9)
- [Cognito documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito-readme.html)
- [Cognito Angular with Amplify](https://resonant-cement-f3c.notion.site/Implementing-Amazon-Cognito-Authentication-in-Angular-using-AWS-Amplify-dc88cce964d34fb0b41417d76d61efe0)
- [Event destination cyclic reference issue](https://github.com/aws/aws-cdk/issues/11245)
- [Lambda layers](https://www.youtube.com/watch?v=jyuZDkiHe2Q)
- [ffmpeg local installation](https://www.youtube.com/watch?v=IECI72XEox0)
- [ffmpeg python](https://www.youtube.com/watch?v=ucXTQ0V8qMA)
- [ffmpeg static library](https://www.johnvansickle.com/ffmpeg/)
- [ffmpeg python subprocess](https://www.youtube.com/watch?v=ucXTQ0V8qMA&t=327s)
- [Creating static ffmpeg zip & uploading it to Lambda layer](https://www.youtube.com/watch?v=NQMC1du9pxg)
- [Lambda layer zip structure](https://docs.aws.amazon.com/lambda/latest/dg/packaging-layers.html)
- [Python lambda layers](https://docs.aws.amazon.com/lambda/latest/dg/python-layers.html)
- [DynamoDB playlist](https://www.youtube.com/playlist?list=PL9nWRykSBSFi5QD8ssI0W5odL9S0309E2)
- [Advanced data modeling with DynamoDB](https://www.youtube.com/watch?v=PVUofrFiS_A)
