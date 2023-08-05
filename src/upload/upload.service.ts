import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';

@Injectable()
export class UploadService {
  private mac: qiniu.auth.digest.Mac;
  private bucket: string;
  constructor() {
    const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET } = process.env;
    this.mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);
    this.bucket = QINIU_BUCKET;
  }

  generateToken() {
    const putPolicy = new qiniu.rs.PutPolicy({ scope: this.bucket });
    return putPolicy.uploadToken(this.mac);
  }
}
