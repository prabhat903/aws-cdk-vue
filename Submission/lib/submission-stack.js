const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const { Bucket } = require("@aws-cdk/aws-s3");
const {
  Effect,
  PolicyStatement,
  PolicyDocument,
  ServicePrincipal,
  Role,
} = require("@aws-cdk/aws-iam");
const apigateway = require("@aws-cdk/aws-apigateway");

const path = require("path");

class SubmissionStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    const build = path.resolve(__dirname, ".././build");
    const functionName = "process";
    const tableName = "product";

    const table = new dynamodb.Table(this, `${tableName}-table`, {
      tableName: `${tableName}-table`,
      partitionKey: {
        name: "product_Type",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "product_Id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const dynamoDBPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ["*"],
      actions: [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
      ],
    });

    const fn = new lambda.Function(this, `${functionName}-lambda`, {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: `${functionName}.handler`,
      code: lambda.Code.fromAsset(path.join(build)),
      environment: {},
      functionName,
      timeout: cdk.Duration.seconds(60),
    });
    fn.addToRolePolicy(dynamoDBPolicy);

    const UIBkt = new Bucket(this, "product-ui-submission", {
      bucketName: "product-ui-submission",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // The code that defines your stack goes here
    this.createAPIGateway(UIBkt, fn);
  }

  createRole() {
    const policies = [
      {
        Principal: "*",
        resources: ["*"],
        actions: ["s3:Get*", "s3:List*"],
      },
      {
        resources: ["*"],
        Principal: "*",
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents",
        ],
      },
    ];
    const policiesStatement = policies.map((ele) => {
      return new PolicyStatement(ele);
    });
    const apiPolicyDoc = new PolicyDocument({
      statements: policiesStatement,
    });

    const apiS3Role = new Role(this, "API_S3_ACCESS", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
      roleName: "API_S3_ACCESS",
      inlinePolicies: { apiPolicyDoc },
    });

    return apiS3Role;
  }
  createAPIGateway(UIBkt, lambda) {
    const apiS3Role = this.createRole();
    const api = new apigateway.RestApi(this, "submission", {});

    const rootResponseModel = api.addModel("RootResponseModel", {
      contentType: "text/html",
      schema: {},
    });

    api.root.addMethod(
      "GET",
      new apigateway.AwsIntegration({
        service: "s3",
        integrationHttpMethod: "GET",
        path: `${UIBkt.bucketName}/index.html`,
        region: "us-east-1",
        options: {
          credentialsRole: apiS3Role,
          integrationResponses: [{ statusCode: "200" }],
        },
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseModels: {
              "text/html": rootResponseModel,
            },
          },
        ],
      }
    );
    const rest = api.root.addResource("rest");
    const restResponseModel = api.addModel("RestResponseModel", {
      contentType: "application/json",
      schema: {},
    });

    rest.addMethod("POST", new apigateway.LambdaIntegration(lambda, {}), {
      methodResponses: [
        {
          statusCode: "200",
          responseModels: {
            "application/json": restResponseModel,
          },
        },
      ],
    });

    const cssResponseModel = api.addModel("CSSResponseModel", {
      contentType: "text/css",
      schema: {},
    });

    const css = api.root.addResource("css");
    const cssFile = css.addResource("{file}", {
      defaultMethodOptions: {
        requestParameters: {},
      },
    });
    cssFile.addMethod(
      "GET",
      new apigateway.AwsIntegration({
        service: "s3",
        integrationHttpMethod: "GET",
        path: `${UIBkt.bucketName}/css/{file}`,
        region: "us-east-1",
        options: {
          credentialsRole: apiS3Role,
          integrationResponses: [{ statusCode: "200" }],
          requestParameters: {
            "integration.request.path.file": "method.request.path.file",
          },
        },
      }),
      {
        requestParameters: {
          "method.request.path.file": true,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseModels: {
              "text/css": cssResponseModel,
            },
          },
        ],
      }
    );

    const jsResponseModel = api.addModel("JSResponseModel", {
      contentType: "text/javascript",
      schema: {},
    });
    const js = api.root.addResource("js");
    const jsFile = js.addResource("{file}");
    jsFile.addMethod(
      "GET",
      new apigateway.AwsIntegration({
        service: "s3",
        integrationHttpMethod: "GET",
        path: `${UIBkt.bucketName}/js/{file}`,
        region: "us-east-1",
        options: {
          credentialsRole: apiS3Role,
          integrationResponses: [{ statusCode: "200" }],
          requestParameters: {
            "integration.request.path.file": "method.request.path.file",
          },
        },
      }),
      {
        requestParameters: {
          "method.request.path.file": true,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseModels: {
              "text/javascript": jsResponseModel,
            },
          },
        ],
      }
    );
  }
}

module.exports = { SubmissionStack };
