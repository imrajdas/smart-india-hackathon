import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {

   
   let response = {}
   const params = {
        TableName: process.env.OFFICIERS_TABLE,
        IndexName: 'username-index',
        KeyConditionExpression: '#username = :username',
        FilterExpression: '#password = :password',
        ExpressionAttributeNames:{
            '#username': 'username',
            '#password': 'password'
        },
        ExpressionAttributeValues: {
            ':username': event.pathParameters.username,
            ':password': event.pathParameters.password// status 1- not deleted, 0- deleted
            // ':username': 'dasraj10015',
            // ':password': 'SWlglkfqWN'
        }
    };

   documentClient.query(params, (err, result) => {
        if(err) {
            console.log(err);
            callback(null , failure({ status: false, message: 'auth failed' }))
        } else {
            console.log(result)
            if(result.Count === 1){
                callback(null , success({ status: true, message: result.Items }))
            }

            else if(result.Count === 0){
                callback(null , success({ status: false, message: 'not valid' }))
            }
        }
   })
}