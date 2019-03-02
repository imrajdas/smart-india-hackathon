import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {
  
   const data = JSON.parse(event.body)
   console.log(data);
   
   /*
        1- approved
   */
   if(data.type == 1){
        const params = {
                TableName: process.env.COMPLAINTS_TABLE,
                Key: {
                    complaintid: parseInt(event.pathParameters.complaintid)
                },
                UpdateExpression: `SET #status = :2`,
                ExpressionAttributeNames:{
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                ":2": 2
                },
                ReturnValues: "ALL_NEW"
        };

        documentClient.update(params, (err, result) => {
                if(err) {
                    console.log(err);
                    callback(null , failure({ status: false, message: 'failed to registered complaint' }))
                } else {
                    console.log(params)
                    callback(null, success({status: true, message: 'successfully updated' }))
                }
        })

   }
   // decline complaints
   else if(data.type === 2){
        const params = {
            TableName: process.env.COMPLAINTS_TABLE,
            Key: {
                complaintid: parseInt(event.pathParameters.complaintid)
            },
            UpdateExpression: `SET #status = :5`,
            ExpressionAttributeNames:{
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ":5": 5
            },
            ReturnValues: "ALL_NEW"
    };

    documentClient.update(params, (err, result) => {
            if(err) {
                console.log(err);
                callback(null , failure({ status: false, message: 'failed to registered complaint' }))
            } else {
                console.log(params)
                callback(null, success({status: true, message: 'successfully deleted' }))
            }
    })
   }
   
}