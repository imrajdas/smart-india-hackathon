import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();
var jwt = require('jsonwebtoken');

var sns = new aws.SNS({
    region: 'eu-west-1',
    apiVersion: '2010-03-31'
});

export const main = (event, context, callback) => {

    var params = {
        Message: 'STRING_VALUE', /* required */
        PhoneNumber: '+917809694275',
        MessageStructure: 'string',
        Subject: 'STRING_VALUE',
    };

    sns.setSMSAttributes({
        attributes: {
            DefaultSMSType: 'Transactional'
        }
    });

    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
}