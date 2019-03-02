import aws from 'aws-sdk';
import { success, failure } from './inc/response';
const documentClient = new aws.DynamoDB.DocumentClient();
const sgMail = require('@sendgrid/mail');
var jwt = require('jsonwebtoken');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const genPassword = () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 10; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
}

export const main = (event, context, callback) => {

   const data = JSON.parse(event.body)
//    const data = {
//        firstname: "Raj",
//        lastname: "Das",
//        rank: "DC",
//        postingarea: "Bhubaneswar",
//        postedfrom: "2019-08-02",
//        phone: "7809694275",
//        email: "mail.rajdas@gmail.com",
//    }
   console.log(data);
   
   const genUserName = `${data.lastname}${data.firstname}${Math.floor(Math.random() * 90 + 10 * 999)}`
   const genPass = genPassword()
   const complaints = ['0']
   const params = {
       TableName: process.env.OFFICIERS_TABLE,
       Item:{
        officierid: Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365.25),
        firstname: data.firstname,
        lastname: data.lastname,
        rank: data.rank,
        postingarea: data.postingarea,
        postingstate: data.postingstate,
        postingdistrict: data.postingdistrict,
        postingpincode: data.postingpincode,
        postedfrom: data.postedfrom,
        phone: data.phone,
        email: data.email,
        complaints: documentClient.createSet(complaints),
        status: 1,
        username: genUserName.toLowerCase(),
        password: genPass,
        token: jwt.sign({ password: genPass }, 'sih2019'),
        /*
            status: 1 active
        */
        created_at: new Date().toISOString()
       }
   }
 

   documentClient.put(params, (err, result) => {
        if(err) {
            console.log(err);
            callback(null , failure({ status: false, message: 'failed to registered complaint' }))
        } else {
            console.log(params.Item)
            // const msg = {
            //     to: `${data.email}`,
            //     from: 'test@example.com',
            //     subject: 'Complaint Status',
            //     text: `Credentials for login
            //         Username- ${lastname}${firstname}${Math.floor(Math.random() * 90 + 10 * 999)}
            //         Password- ${genPassword}
            //     `,
            // };
            // sgMail.send(msg);
        
            callback(null, success({status: true, message: 'officier add successfully' }))
        }
   })
}