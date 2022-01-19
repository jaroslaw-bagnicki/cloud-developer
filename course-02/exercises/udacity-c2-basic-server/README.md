# udacity-c2-basic-server

This is a simple node-express server to explore and understand the Request-Response pattern.

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

***
## Important Files and Project Structure

The source code for this demo resides in the ./src directory.

### src/server.ts
The main code for this demo is located in the ./src/server.ts file. This includes 

### src/cars.ts
This is a javascript object containing a list of cars. This will be useful for providing data for our simple endpoints.

### src/unit-test-examples/
This directory contains some simple unit functions (`units.ts`) and corresponding tests using Mocha and Chai (`units.tests.ts`).

***
# Tasks
1. @TODO `./src/server.ts/`
Add an endpoint to GET a list of cars.

2. @TODO `./src/server.ts/` 
Add an endpoint to get a specific car.

3. @TODO `./src/server.ts/` 
Add an endpoint to post a new car to our list.

4. @TODO `./src/unit-test-examples/units.ts`
Try creating a method "concat" to concatenate two strings.

5. @TODO `./src/unit-test-examples/units.tests.ts`
Try creating a new describe block for the "concat" method.

# CLI command to create S3 bucket from Lesson 3

### Create bucket with name `udagram-dev-4ik35k`

```bash
export BUCKET=udagram-dev-4ik35k

# Create bucket
aws s3api create-bucket --bucket $BUCKET --create-bucket-configuration LocationConstraint=us-east-1

# Set bucket access block
aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration file://s3_access-block.json

# Set bucket CORS
aws s3api put-bucket-cors --bucket $BUCKET --cors-configuration file://s3_cors.json

# Set bucket encrypion
aws s3api put-bucket-encryption --bucket $BUCKET --server-side-encryption-configuration file://s3_encryption.json
```

### Setup IAM `udagram-devs` group

``` bash
# Validating policy document
aws accessanalyzer validate-policy --policy-document file://iam_media-bucket-access-policy.json --policy-type IDENTITY_POLICY

# Create IAM policy with access to bucket
aws iam create-policy --policy-name UdagramMediaBucketFullAccessPolicy --policy-document file://iam_media-bucket-access-policy.json

------------------------------------------------------------------------------------------------------------
|                                               CreatePolicy                                               |
+----------------------------------------------------------------------------------------------------------+
||                                                 Policy                                                 ||
|+--------------------------------+-----------------------------------------------------------------------+|
||  Arn                           |  arn:aws:iam::108792290315:policy/UdagramMediaBucketFullAccessPolicy  ||
||  AttachmentCount               |  0                                                                    ||
||  CreateDate                    |  2022-01-18T08:42:06+00:00                                            ||
||  DefaultVersionId              |  v1                                                                   ||
||  IsAttachable                  |  True                                                                 ||
||  Path                          |  /                                                                    ||
||  PermissionsBoundaryUsageCount |  0                                                                    ||
||  PolicyId                      |  ANPARSVEGTQF34HK4FFBR                                                ||
||  PolicyName                    |  UdagramMediaBucketFullAccessPolicy                                   ||
||  UpdateDate                    |  2022-01-18T08:42:06+00:00                                            ||
|+--------------------------------+-----------------------------------------------------------------------+|

# Update policy
aws iam create-policy-version --policy-arn arn:aws:iam::108792290315:policy/UdagramMediaBucketFullAccessPolicy --policy-document file://iam_media-bucket-access-policy.json --set-as-default

------------------------------------------------------------------
|                       CreatePolicyVersion                      |
+----------------------------------------------------------------+
||                         PolicyVersion                        ||
|+----------------------------+--------------------+------------+|
||         CreateDate         | IsDefaultVersion   | VersionId  ||
|+----------------------------+--------------------+------------+|
||  2022-01-18T09:05:44+00:00 |  True              |  v2        ||
|+----------------------------+--------------------+------------+|

# Create IAM group
aws iam create-group --group-name UdagramDevs

--------------------------------------------------------------------------------------------------------------------------------
|                                                          CreateGroup                                                         |
+------------------------------------------------------------------------------------------------------------------------------+
||                                                            Group                                                           ||
|+----------------------------------------------+----------------------------+------------------------+--------------+--------+|
||                      Arn                     |        CreateDate          |        GroupId         |  GroupName   | Path   ||
|+----------------------------------------------+----------------------------+------------------------+--------------+--------+|
||  arn:aws:iam::108792290315:group/UdagramDevs |  2022-01-18T08:46:05+00:00 |  AGPARSVEGTQF5LZTF6BJ7 |  UdagramDevs |  /     ||
|+----------------------------------------------+----------------------------+------------------------+--------------+--------+|

# Attach policy to group
aws iam attach-group-policy --group-name UdagramDevs --policy-arn arn:aws:iam::108792290315:policy/UdagramMediaBucketFullAccessPolicy
```

### Setup user role

```bash

# Create role
aws iam create-role --role-name UdagramTestRole --assume-role-policy-document file://iam_test-trust-policy.json

---------------------------------------------------------------------------------------------------------------------------------------
|                                                             CreateRole                                                              |
+-------------------------------------------------------------------------------------------------------------------------------------+
||                                                               Role                                                                ||
|+-------------------------------------------------+----------------------------+-------+------------------------+-------------------+|
||                       Arn                       |        CreateDate          | Path  |        RoleId          |     RoleName      ||
|+-------------------------------------------------+----------------------------+-------+------------------------+-------------------+|
||  arn:aws:iam::108792290315:role/UdagramTestRole |  2022-01-19T06:59:10+00:00 |  /    |  AROARSVEGTQF3YH7PJZWG |  UdagramTestRole  ||
|+-------------------------------------------------+----------------------------+-------+------------------------+-------------------+|
|||                                                    AssumeRolePolicyDocument                                                     |||
||+--------------------------------------------------------+------------------------------------------------------------------------+||
|||  Version                                               |  2012-10-17                                                            |||
||+--------------------------------------------------------+------------------------------------------------------------------------+||
||||                                                           Statement                                                           ||||
|||+---------------------------------------------------------------------------------+---------------------------------------------+|||
||||                                     Action                                      |                   Effect                    ||||
|||+---------------------------------------------------------------------------------+---------------------------------------------+|||
||||  sts:AssumeRole                                                                 |  Allow                                      ||||
|||+---------------------------------------------------------------------------------+---------------------------------------------+|||
|||||                                                          Principal                                                          |||||
||||+----------------+------------------------------------------------------------------------------------------------------------+||||
|||||  AWS           |  arn:aws:iam::108792290315:role/voclabs                                                                    |||||
||||+----------------+------------------------------------------------------------------------------------------------------------+||||

# Attach policy to role
aws iam attach-role-policy --role-name UdagramTestRole --policy-arn arn:aws:iam::108792290315:policy/UdagramMediaBucketFullAccessPolicy

# Assume role
aws sts assume-role --role-arn arn:aws:iam::108792290315:role/UdagramTestRole --role-session-name TestRoleSession --output json

{
    "Credentials": {
        "AccessKeyId": "ASIARSVEGTQFSLAECMEH",
        "SecretAccessKey": "tc2Cei6wXhi9GChTab5XewxACxDPhptKF9+59IO3",
        "SessionToken": "IQoJb3JpZ2luX2VjEM///////////wEaCXVzL...",
        "Expiration": "2022-01-19T08:03:04+00:00"
    },
    "AssumedRoleUser": {
        "AssumedRoleId": "AROARSVEGTQF3YH7PJZWG:test",
        "Arn": "arn:aws:sts::108792290315:assumed-role/UdagramTestRole/test"
    }
}
```
[`iam_test-trust-policy.json`](./iam_test-trust-policy.json)
