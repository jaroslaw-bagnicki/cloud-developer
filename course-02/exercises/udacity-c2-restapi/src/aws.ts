import AWS = require('aws-sdk');
import { getConfiguration } from './config/configurationProvider';

//Configure AWS
if(process.env.AWS_PROFILE !== "DEPLOYED") {
  var credentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE });
  AWS.config.credentials = credentials;
}
export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
});


/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export async function getGetSignedUrl( key: string ): Promise<string> {

    const signedUrlExpireSeconds = 60 * 5;

    const c = await getConfiguration();

    const url = s3.getSignedUrl('getObject', {
      Bucket: c.filestore.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds
    });

  return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export async function getPutSignedUrl(key: string): Promise<string> {

    const c = await getConfiguration();
  
    const signedUrlExpireSeconds = 60 * 5;

    const url = s3.getSignedUrl('putObject', {
      Bucket: c.filestore.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds
    });

    return url;
}
