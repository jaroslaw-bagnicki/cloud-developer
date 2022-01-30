import AWS = require('aws-sdk');

const ssm = new AWS.SSM();

const getValueFromSsm = async (key: string): Promise<string> => ssm
  .getParameter({ Name: key })
  .promise()
  .then(result => {
    if (!result.$response.error) {
      if (!result.$response.data) {
        throw new Error('Paramater not found!');
      }

      const data = <AWS.SSM.GetParameterResult>(result.$response.data);
      return data?.Parameter?.Value;
    }
    throw result.$response.error.message;
  });

export const getConfiguration = async () => ({
  'db': {
    'host': await getValueFromSsm(process.env.POSTGRES_HOST_KEY),
    'database': await getValueFromSsm(process.env.POSTGRES_DATABASE_KEY),
    'username': await getValueFromSsm(process.env.POSTGRES_USERNAME_KEY),
    'password': await getValueFromSsm(process.env.POSTGRES_PASSWORD_KEY),
  },
  'filestore': {
    'aws_media_bucket': await getValueFromSsm(process.env.AWS_MEDIA_BUCKET_KEY),
    'aws_region': process.env.AWS_REGION,
  },
  'aws_profile': process.env.AWS_PROFILE,
});
