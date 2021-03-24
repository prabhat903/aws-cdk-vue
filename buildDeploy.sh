
npm i
npm i aws-cdk -g
npm run cdk

cd Vue/app
npm i

npm run build

aws s3 sync dist s3://product-ui-submission/
