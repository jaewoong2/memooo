import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { awsConfig } from 'src/core/config/aws.config';

@Injectable()
export class S3Service {
  constructor(
    @Inject(awsConfig.KEY)
    private config: ConfigType<typeof awsConfig>,
  ) {}

  private s3 = new S3({
    region: 'ap-northeast-2',
    credentials: {
      accessKeyId: this.config.aws.s3.accessKeyId,
      secretAccessKey: this.config.aws.s3.secretAccessKey,
    },
  });
  private bucketName = this.config.aws.s3.bucketName;

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const key = `images/${Date.now()}_${file.originalname}`;
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.upload(params).promise();
    return `${this.config.aws.s3.cloudfrontURL}/${key}`; // 업로드된 파일의 URL 반환
  }
}
