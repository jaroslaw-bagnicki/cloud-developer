import AWS = require('aws-sdk');

const ssm = new AWS.SSM();
const keyPrefix = `/${process.env.APP_NAME}/${process.env.STAGE}/${process.env.SERVICE_NAME}`;

const getValueFromSsm = async (key: string): Promise<string> => ssm
  .getParameter({ Name: keyPrefix + key })
  .promise()
  .then(result => {
    if (result.$response.error) {
      throw new Error(result.$response.error.message);
    }
    const data = <AWS.SSM.GetParameterResult>(result.$response.data);
    return data?.Parameter?.Value;
  })
  .catch(err => {
    if (err.code = 'ParameterNotFound') {
      console.error(`Paramater: '${keyPrefix + key}' not found!`);
    } else {
      console.error(err.message);
    }
    return null;
  });

export const getConfiguration = async () => {
  return {
    'aws_profile': process.env.AWS_PROFILE,
    'db': {
      'host': await getValueFromSsm('/db/host'),
      'database': await getValueFromSsm('/db/dbname'),
      'username': await getValueFromSsm('/db/username'),
      'password': await getValueFromSsm('/db/password'),
    },
    'filestore': {
      'aws_media_bucket': await getValueFromSsm('/filestore/bucket'),
      'aws_region': process.env.AWS_REGION,
    },
    'jwt': {
      'secret': await getValueFromSsm('/jwt/secret'),
    }
  };
};
