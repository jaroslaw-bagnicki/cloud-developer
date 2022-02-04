# Udagram REST API

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. 
2. [The RestAPI Backend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi), a Node-Express server which can be deployed to a cloud service.
3. [The Image Filtering Microservice](https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images.


***
## Getting Setup

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:
```bash
npm install
```
>_tip_: **npm i** is shorthand for **npm install**

### Installing useful tools
#### 1. [Postbird](https://github.com/paxa/postbird)
Postbird is a useful client GUI (graphical user interface) to interact with our provisioned Postgres database. We can establish a remote connection and complete actions like viewing data and changing schema (tables, columns, ect).

#### 2. [Postman](https://www.getpostman.com/downloads/)
Postman is a useful tool to issue and save requests. Postman can create GET, PUT, POST, etc. requests complete with bodies. It can also be used to test endpoints automatically. We've included a collection (`./udacity-c2-restapi.postman_collection.json `) which contains example requsts.

***

## Running the Server Locally
To run the server locally in developer mode, open terminal and run:
```bash
npm run dev
```

Developer mode runs off the TypeScript source. Any saves will reset the server and run the latest version of the codebase. 

## Attaching policy to group using CLI

```bash
aws iam attach-group-policy --group-name UdagramDevs --policy-arn arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk

# Helper commands
aws iam list-policies --query 'Policies[?contains(PolicyName,`Beanstalk`)].[PolicyName,Arn]'
aws iam list-groups
aws iam list-attached-group-policies --group-name UdagramDevs
```

## Getting info about instances

Get list offered instances base on regon and instance family
```bash
aws ec2 describe-instance-type-offerings \
    --region us-east-1 \
    --filters 'Name=instance-type,Values=t*' \
    --query 'InstanceTypeOfferings[].InstanceType'
```

## Elastic Beanstalk
Updating **Elastic Beanstalk** environment configuration: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environment-configuration-methods-after.html#configuration-options-after-ebcli


## Deploying application to Elastic Beanstalk
```bash
# Building EB artifact
npm run build

# Deploying new version of appliaction
eb deploy

# Retrieve EB Enironment URL based on environment name
aws elasticbeanstalk describe-environments --query 'Environments[?EnvironmentName==`udagram-dev`].[CNAME]'
```

## Create IAM role for EC2 instance
```bash
aws iam create-role --role-name UdagramWebServerRole --assume-role-policy-document file://iam_ec2-trust-policy.json --path /udagram/
aws iam attach-role-policy --role-name UdagramWebServerRole --policy-arn arn:aws:iam::108792290315:policy/UdagramMediaBucketFullAccessPolicy
aws iam create-instance-profile --instance-profile-name UdagramWebServerInstanceProfile --path /udagram/
aws iam add-role-to-instance-profile --instance-profile-name UdagramWebServerInstanceProfile --role-name UdagramWebServerRole
aws iam get-instance-profile --instance-profile-name UdagramWebServerInstanceProfile
aws iam list-instance-profiles --path-prefix /udagram/
```

## Move secrets and other sensitive variables to SSM Parameter store
```bash
# Set parameter value
aws ssm put-parameter --name /udagram/dev/web/db/host --type String --value ******.us-east-1.rds.amazonaws.com

# Get parameters and values by key prefix
aws ssm get-parameters-by-path --path /udagram/ --recursive --query 'Parameters[].[Name,Value]'
```
### List of configuration keys used by application
```
/udagram/dev/web/db/host
/udagram/dev/web/db/dbname
/udagram/dev/web/db/username
/udagram/dev/web/db/password
/udagram/dev/web/filestore/bucket
/udagram/dev/web/jwt/secret
```

## Enhance EC2 service role with read access to SSM ParameterStore
```bash
aws iam create-policy --policy-name UdagramConfigurationGetAccess --policy-document file://ssm_application-config-get-get-access.json
aws iam attach-role-policy --role-name UdagramWebServerRole --policy-arn arn:aws:iam::108792290315:policy/UdagramConfigurationGetAccess
```