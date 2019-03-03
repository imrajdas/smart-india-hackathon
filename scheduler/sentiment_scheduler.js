import aws from 'aws-sdk';
import unirest from 'unirest'
import { type } from 'os';
const parse = aws.DynamoDB.Converter.output;
const documentClient = new aws.DynamoDB.DocumentClient();


export const main = (event, context, callback) => {
    console.log(event);

    event.Records.map((record) => {
        
        console.log(record.dynamodb);
        const data = record.dynamodb.NewImage
        const parseData = parse({ 'M':  data})
        console.log(parseData);
        
        unirest.post("https://twinword-sentiment-analysis.p.rapidapi.com/analyze/")
            .header("X-RapidAPI-Key", "62dd815ademshcf679202994df15p1fe0cfjsn37bc51555640")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .send(`text=${parseData.complaint_desc}`)
            .end(function (result) {
                console.log(result.body); 
                if(result.body.type === 'negative'){
                    if(result.body.score < -0.001){
                        console.log('critical')

                        const params = {
                            TableName: process.env.COMPLAINTS_TABLE,
                            Key: {
                                complaintid: parseInt(parseData.complaintid)
                            },
                            UpdateExpression: `SET #priority = :priority, #critical = :true`,
                            ExpressionAttributeNames:{
                                '#priority': 'priority',
                                '#critical': 'critical',
                            },
                            ExpressionAttributeValues: {
                                ':priority': result.body.score,
                                ':true': true
                            },
                            ReturnValues: 'ALL_NEW'
                        }

                        documentClient.update(params, (err, result) => {
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log('success',result);
                                
                            }
                        })
                    }
                }
        });
    })
    
}