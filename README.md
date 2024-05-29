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
`./lib` - initializes code for creating cloud infrastrucutre
`./bin` - executes functions from `./lib` directory
`./test` - test environment
`./cdk.json` - don`t touch 
`./jest.config.js` - starts tests (defines test suite)
`./package.json` - dependecies
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