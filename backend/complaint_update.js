import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();
const axios = require('axios')

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
                            complaintid: parseInt(data.complaintid)
                        },
                        UpdateExpression: `SET #officierid = :officierid, #officier_assigned = :officier_assigned, #status = :1`,
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
                            ':complaints': documentClient.createSet([data.complaintid.toString()])
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

                const new_params = {
                    TableName: process.env.OFFICIERS_TABLE,
                    Key: {
                        officierid: parseInt(data.old_officierid)
                    },
                    UpdateExpression: `DELETE #complaints :complaints`,
                    ExpressionAttributeNames:{
                        '#complaints': 'complaints'
                    },
                    ExpressionAttributeValues: {
                        ':complaints': documentClient.createSet([data.complaintid.toString()])
                    },
                    ReturnValues: 'ALL_NEW'
                }

                console.log(new_params);
                
                documentClient.update(new_params, (err, results) => {
                    if(err) {
                      console.log(err)
                      callback(null, failure({ status: false, message: 'Delete failed'}))
                    } else {
                      console.log(results)
                      const msg = `Your complaint has been transfered to ${data.officername} of complaintID- ${data.complaintid} `
                      const url = `http://login.smsadda.com/API/pushsms.aspx?loginID=giit&password=giitpc&mobile=+91${data.complainee_phoneno}&text=${msg}&senderid=GIITPC&route_id=1&Unicode=0`
          
                      axios.get(url).then(function(response){
                        console.log(response);
                        callback(null, success({status: true, message: 'successfully transferred' }))
                        })
                        .catch(function(err){
                            console.log(err);
                        })

                        // callback(null, success({status: true, message: 'successfully transfered' }))

                    }
                })
            }
        })
   }

   //close report
   else if(data.type == 4){
        const params= {
            TableName: process.env.COMPLAINTS_TABLE,
            Key: {
                complaintid: parseInt(data.complaintid)
            },
            UpdateExpression: `SET #reports = list_append(#reports, :reports), #status =:status`,
            ExpressionAttributeNames:{
                '#reports': 'reports',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':reports': [{
                    closing_statement: data.closing_statement,
                    report_file: data.report_file
                }],
                ':status': 3
            },
        }
        console.log(params);
        documentClient.update(params, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                console.log(result)
                callback(null, success({status: true, message: 'complaint closed' }))

            }
        })
   }
   
}