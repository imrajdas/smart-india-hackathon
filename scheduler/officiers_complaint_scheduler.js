import aws from 'aws-sdk';
import unirest from 'unirest'
const parse = aws.DynamoDB.Converter.output;
const documentClient = new aws.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {
    console.log(event);
    event.Records.map((record) => {
        
        console.log(record.dynamodb);
        const data = record.dynamodb.NewImage
        const parseData = parse({ 'M':  data})
        console.log(parseData);
        
        const params = {
            TableName: process.env.COMPLAINTS_TABLE,
            IndexName: 'officier_assigned-index',
            KeyConditionExpression: '#officier_assigned = :officier_assigned',
            FilterExpression: 'pincode = :pincode',
            ExpressionAttributeNames:{
                '#officier_assigned': 'officier_assigned'
            },
            ExpressionAttributeValues: {
                ':officier_assigned': 0,
                ':pincode': parseData.postingpincode  
            }
        };
        console.log(params);
        
        documentClient.query(params, (err, results) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(results)
                    updateOfficier(results.Items)
                }
        })
    
        const updateOfficier = (results) => {
        
                results.map((result) => {
                    const params = {
                        TransactItems: [
                            {
                                Update: {
                                    TableName: process.env.COMPLAINTS_TABLE,
                                    Key: {
                                        complaintid: parseInt(result.complaintid)
                                    },
                                    UpdateExpression: `SET #officierid = :officierid, #officier_assigned = :officier_assigned`,
                                    ExpressionAttributeNames:{
                                        '#officierid': 'officierid',
                                        '#officier_assigned': 'officier_assigned'
                                    },
                                    ExpressionAttributeValues: {
                                        ":officierid": parseInt(parseData.officierid),
                                        ":officier_assigned": 1
                                    },
                                    ReturnValues: "ALL_NEW"
                                }
                            },
                            {
                                Update: {
                                    TableName: process.env.OFFICIERS_TABLE,
                                    Key: {
                                        officierid: parseInt(parseData.officierid)
                                    },
                                    UpdateExpression: `ADD #complaints :complaints`,
                                    ExpressionAttributeNames:{
                                        '#complaints': 'complaints'
                                    },
                                    ExpressionAttributeValues: {
                                        ":complaints": documentClient.createSet([result.complaintid.toString()])
                                    },
                                    ReturnValues: "ALL_NEW"
                                }
                            }
                        ]
                    }
                    console.log(params.TransactItems);
                    
                    documentClient.transactWrite(params, (err, result) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log('success',result)
                        }
                    })
        
                })
                
        
        }  
    
    })

    


    

}