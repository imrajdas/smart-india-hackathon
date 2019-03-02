import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {

    const data = JSON.parse(event.body)
    console.log(data);

    /*
        status 0- not assigned
        status 1- new complaints
        status 2- pending complaints
        status 3- closed complaints
        status 4- Search complaints
        status 5- decline complaints

    */

    if(data.type === 1){
        const params = {
            TableName: process.env.COMPLAINTS_TABLE,
            IndexName: 'officierid-index',
            KeyConditionExpression: '#officierid = :officierid',
            FilterExpression: '#status = :1',
            ExpressionAttributeNames:{
                '#officierid': 'officierid',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':officierid': parseInt(event.pathParameters.officierid),
                // ':officierid': 25570227430
                ':1': 1
    
            }
        };
    
       documentClient.query(params, (err, results) => {
            if(err) {
                console.log(err);
                callback(null , failure({ status: false, message: 'failed to get the list' }))
            } else {
                console.log(results)
                callback(null , success({ status: true, message: results.Items }))
    
            }
       })
    }

    else if(data.type === 2){
        const params = {
            TableName: process.env.COMPLAINTS_TABLE,
            IndexName: 'officierid-index',
            KeyConditionExpression: '#officierid = :officierid',
            FilterExpression: '#status = :2',
            ExpressionAttributeNames:{
                '#officierid': 'officierid',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':officierid': parseInt(event.pathParameters.officierid),
                // ':officierid': 25570227430
                ':2': 2
    
            }
        };
    
       documentClient.query(params, (err, results) => {
            if(err) {
                console.log(err);
                callback(null , failure({ status: false, message: 'failed to get the list' }))
            } else {
                console.log(results)
                callback(null , success({ status: true, message: results.Items }))
    
            }
       })
    }

    else if(data.type === 3){
        const params = {
            TableName: process.env.COMPLAINTS_TABLE,
            IndexName: 'officierid-index',
            KeyConditionExpression: '#officierid = :officierid',
            FilterExpression: '#status = :3 OR #status = :5',
            ExpressionAttributeNames:{
                '#officierid': 'officierid',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':officierid': parseInt(event.pathParameters.officierid),
                // ':officierid': 25570227430
                ':3': 3,
                ':5': 5
    
            }
        };
    
       documentClient.query(params, (err, results) => {
            if(err) {
                console.log(err);
                callback(null , failure({ status: false, message: 'failed to get the list' }))
            } else {
                console.log(results)
                callback(null , success({ status: true, message: results.Items }))
    
            }
       })
    }
    
}