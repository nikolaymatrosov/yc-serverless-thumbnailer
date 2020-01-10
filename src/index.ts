import * as S3 from 'aws-sdk/clients/s3';
import * as sharp from 'sharp';
import * as stream from 'stream';
import {YC} from "./objectStorageMessage";

const re = RegExp('(\.jpg|\.png|\.gif)$', 'i');

const {AWS_ACCESS_KEY, AWS_SECRET_KEY, TARGET_BUCKET} = process.env;

const s3Config: S3.Types.ClientConfiguration = {
    apiVersion: '2006-03-01',
    region: 'ru-central1',
    signatureVersion: 'v4',
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    endpoint: 'storage.yandexcloud.net',
    s3ForcePathStyle: true,
};
const s3 = new S3(s3Config);
const transformer = sharp().resize({
    width: 200,
    height: 200,
    fit: sharp.fit.cover,
});

export async function handler(event: YC.ObjectStorageEvent) {
    const {bucket_id, object_id} = event.messages[0].details;
    if (object_id.match(re) === null) {
        return;
    }

    const s3GetObjectStream = s3.getObject({
        Bucket: bucket_id,
        Key: object_id
    }).createReadStream();

    const pass = new stream.PassThrough();

    const result = s3.upload({Bucket: TARGET_BUCKET, Key: object_id, Body: pass}).promise();

    s3GetObjectStream
        .pipe(transformer)
        .pipe(pass);

    return await result;
}
