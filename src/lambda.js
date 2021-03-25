const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const log = (...args) => {
  const args1 = args.map((e) => {
    return typeof e == "object" ? JSON.stringify(e) : e;
  });
  console.log(...args1);
};

AWS.config.update({
  region: process.env.REGION || "us-east-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

const writeToDb = async (payload) => {
  const Item = {
    product_Type: payload.product_Type.toLowerCase(),
    product_Id: uuidv4(),
    description: payload.description,
    product_Name: payload.product_Name,
    info: { ...payload.info },
  };
  var params = {
    TableName: tableName,
    Item,
  };
  log("Adding a new item...", params);
  return await docClient
    .put(params)
    .promise()
    .then((data) => {
      log("Added item:", data);
      return sucessResponce(data);
    })
    .catch((err) => {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      throw err;
    });
};

const readFromDb = async ({ types = [] }) => {
  const promises = types.map((ele) => {
    var params = {
      TableName: tableName,
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "product_Type",
      },
      ExpressionAttributeValues: {
        ":type": ele.toLowerCase(),
      },
    };
    log("----params", params);
    return docClient.query(params).promise();
  });
  const result = await Promise.all(promises)
    .then((data) => {
      log("Query succeeded.", data);
      const res = data.reduce((resp, ele) => {
        return [...resp, ...ele.Items];
      }, []);
      return sucessResponce(res);
    })
    .catch((err) => {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    });
  log("----result", result);
  return result;
};

const deleteToDb = async ({ type = "", id }) => {
  var params = {
    TableName: tableName,
    Key: {
      product_Type: type.toLowerCase(),
      product_Id: id,
    },
  };
  return await docClient
    .delete(params)
    .promise()
    .then(() => {
      return sucessResponce("Success");
    });
};
const sucessResponce = (data) => {
  var response = {
    statusCode: 200,
    body: JSON.stringify(data),
    isBase64Encoded: false,
  };
  return response;
};
const handler = async (event, context, callback) => {
  try {
    const { action = "", payload = {} } = JSON.parse(event.body);
    log("Hello", payload);
    let res = null;
    switch (action) {
      case "WRITE":
        res = await writeToDb(payload);
        callback(null, res);
        break;
      case "READ":
        res = await readFromDb(payload);
        callback(null, res);
        break;
      case "DELETE":
        res = await deleteToDb(payload);
        callback(null, res);
        break;
      default:
        throw new Error("no action found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export { handler };
