
npm i
npm i aws-cdk -g
npm run cdk

export UIBucketName=test-product-ui-submission
echo $UIBKT
cd Vue/app
npm i

npm run build

aws s3 sync dist s3://$UIBucketName/
