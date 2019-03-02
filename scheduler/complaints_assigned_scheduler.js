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
            TableName: process.env.OFFICIERS_TABLE,
            IndexName: 'pincode-index',
            KeyConditionExpression: '#postingpincode = :postingpincode',
            ExpressionAttributeNames:{
                '#postingpincode': 'postingpincode'
            },
            ExpressionAttributeValues: {
                ':postingpincode': parseData.pincode  
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
                let min = results[0]
                
                for(let i=0; i <results.length; i++){
                    if(min.complaints.values.length > results[i].complaints.values.length){
                        min = results[i]
                    }
                }
                
                console.log(min);
                
                const params = {
                    TransactItems: [
                        {
                            Update: {
                                TableName: process.env.COMPLAINTS_TABLE,
                                Key: {
                                    complaintid: parseInt(parseData.complaintid)
                                },
                                UpdateExpression: `SET #officierid = :officierid, #officier_assigned = :officier_assigned`,
                                ExpressionAttributeNames:{
                                    '#officierid': 'officierid',
                                    '#officier_assigned': 'officier_assigned'
                                },
                                ExpressionAttributeValues: {
                                    ":officierid": parseInt(min.officierid),
                                    ":officier_assigned": 1
                                },
                                ReturnValues: "ALL_NEW"
                            }
                        },
                        {
                            Update: {
                                TableName: process.env.OFFICIERS_TABLE,
                                Key: {
                                    officierid: parseInt(min.officierid)
                                },
                                UpdateExpression: `ADD #complaints :complaints`,
                                ExpressionAttributeNames:{
                                    '#complaints': 'complaints'
                                },
                                ExpressionAttributeValues: {
                                    ":complaints": documentClient.createSet([parseData.complaintid.toString()])
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
        }
    })
      
}