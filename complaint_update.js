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
   // tranfer complaints
   else if(data.type == 3){
        const params = {
            TransactItems: [
                {
                    Update: {
                        TableName: process.env.COMPLAINTS_TABLE,
                        Key: {
                            complaintid: parseInt(result.complaintid)
                        },
                        UpdateExpression: `SET #officierid = :officierid, #officier_assigned = :officier_assigned, #status = :status`,
                        ExpressionAttributeNames:{
                            '#officierid': 'officierid',
                            '#officier_assigned': 'officier_assigned',
                            '#status': 'status'
                        },
                        ExpressionAttributeValues: {
                            ':officierid': parseInt(data.officierid),
                            ':officier_assigned': 1,
                            ':1': 1
                        },
                        ReturnValues: 'ALL_NEW'
                    }
                },
                {
                    Update: {
                        TableName: process.env.OFFICIERS_TABLE,
                        Key: {
                            officierid: parseInt(data.officierid)
                        },
                        UpdateExpression: `ADD #complaints :complaints`,
                        ExpressionAttributeNames:{
                            '#complaints': 'complaints'
                        },
                        ExpressionAttributeValues: {
                            ':complaints': documentClient.createSet([data.toString()])
                        },
                        ReturnValues: 'ALL_NEW'
                    }
                }
            ]
        }
        console.log(params.TransactItems);
        
        documentClient.transactWrite(params, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                console.log(params)
                callback(null, success({status: true, message: 'successfully transfered' }))
            }
        })
   }
   
}