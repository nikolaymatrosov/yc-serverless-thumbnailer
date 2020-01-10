#!/bin/sh
yc serverless function create --name=$FUNCTION_NAME
if [[ ! -e "build" ]]; then
    mkdir "build"
fi

cp package.json ./build/package.json
(
    cd build;
    npm install --arch=x64 --platform=linux --target=12.14.0 --production
)
npx tsc --build tsconfig.json
cp src/*.js ./build
rm build.zip || echo '';
(
    cd build;
    zip -r9 ../build.zip .
)

s3cmd put build.zip s3://$FUNCTION_BUCKET/build.zip

yc serverless function version create \
  --function-name=$FUNCTION_NAME \
  --runtime nodejs12 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 30s \
  --package-bucket-name $FUNCTION_BUCKET \
  --package-object-name build.zip\
  --environment AWS_ACCESS_KEY=$AWS_ACCESS_KEY,AWS_SECRET_KEY=$AWS_SECRET_KEY,TARGET_BUCKET=$TARGET_BUCKET


