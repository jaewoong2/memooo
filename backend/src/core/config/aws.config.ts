import { registerAs } from '@nestjs/config';

// src/config/aws.config.ts
export const awsConfig = registerAs('aws', () => ({
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      cloudfrontURL: process.env.AWS_CLOUDFRONT_URL,
    },
    eventBridge: {
      target: {
        arn: process.env.AWS_EVENTBRIDGE_TARGET_ARN,
        roleArn: process.env.AWS_EVENTBRIDGE_TARGET_ROLE_ARN,
      },
    },
  },
}));
