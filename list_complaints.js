import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {

    const params = {
        TableName: process.env.COMPLAINTS_TABLE,
        IndexName: 'officierid-index',
        KeyConditionExpression: '#officierid = :officierid',
        ExpressionAttributeNames:{
            '#officierid': 'officierid',
        },
        ExpressionAttributeValues: {
            ':officierid': parseInt(event.pathParameters.officierid,)
            // ':officierid': 25570227430

        }
    };

   documentClient.query(params, (err, results) => {
        if(err) {
            console.log(err);
            callback(null , failure({ status: false, message: 'failed to registered complaint' }))
        } else {
            console.log(results)
            callback(null , success({ status: true, message: results.Items }))

        }
   })
}