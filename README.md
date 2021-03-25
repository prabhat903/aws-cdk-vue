# Welcome to your CDK JavaScript(AWS) With Vue project!

Features :
Infrastructure --> AWS

- `Lambda` based backend
- intreaction with `API gateway`
- `s3` to hold UI project
- `one line deployment`

Front end created on `Vue`

## Useful commands

clone the Project
export AWS profile
run `sh ./buildDeploy.sh`

- will install node modules for backend
- will install aws-cdk for deployement (aws-cdk@1.94.1)
- will install ui dependencies
- build UI project
- deploy to s3

`You will get a URL under Outputs:`
follow that url to launch the application.

About the App - it is used to manage your sports inventory
you can create Product item as it is added in your inventory in 3 category
you can list and filter Products based on catogory,
when you sold the item, it will be removed from your inventory list

Please update the bucket name in cdk.json and .buildDeploy.sh
