import AWS = require('aws-sdk');

const ssm = new AWS.SSM();
const keyPrefix = `/${process.env.APP_NAME}/${process.env.STAGE}/${process.env.SERVICE_NAME}`;
let configuration: UdagramConfiguration = null;

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
    if (err.code === 'ParameterNotFound') {
      console.error(`Paramater: '${keyPrefix + key}' not found!`);
    } else {
      console.error(err.message);
    }
    return null;
  });

export const getConfiguration = async () => {
  if (!configuration) {
    configuration = {
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
  }
  return configuration;
};

// tslint:disable-next-line: interface-over-type-literal
type UdagramConfiguration = {
  'aws_profile': string,
  'db': {
    'host': string,
    'database': string,
    'username': string,
    'password': string,
  },
  'filestore': {
    'aws_media_bucket': string,
    'aws_region': string
  },
  'jwt': {
    'secret': string,
  }
};

