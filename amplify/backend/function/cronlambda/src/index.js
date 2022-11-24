/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_APPDATA_ARN
	STORAGE_APPDATA_NAME
	STORAGE_APPDATA_STREAMARN
	STORAGE_TELEMONITORING_ARN
	STORAGE_TELEMONITORING_NAME
	STORAGE_TELEMONITORING_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
};
