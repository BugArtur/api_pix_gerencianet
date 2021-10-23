const axios = require('axios');
const fs = require('fs')
const path = require('path')
const https = require('https')

const cert = fs.readFileSync(
    path.resolve(__dirname, `../../certificados/${process.env.GN_CERT}`)
)

const agent = new https.Agent({
    pfx: cert,
    passphrase: '',
})

let credentials = process.env.GN_CLIENT_ID + ':' + process.env.GN_CLIENT_SECRET;
let auth = Buffer.from(credentials).toString('base64');


const authenticate = () => {
    return axios({
        method: 'POST',
        url:`${process.env.GN_ENDPOINT}/oauth/token`,
        headers:{
            Authorization:`Basic ${auth}`,
            'Content-Type': 'application/json'
        },
        httpsAgent: agent,
        data:{
            grant_type: 'client_credentials'
        }
    
    })
}

const GNRequest = async () => {

    const authResponse = await authenticate();
    const acessToken =  authResponse.data?.access_token;

        return  axios.create({
            baseURL: process.env.GN_ENDPOINT,
            httpsAgent: agent,
            headers:{
                Authorization: `Bearer ${acessToken}`,
                'Content-Type' : 'application/json'
            }
        })
}

module.exports=GNRequest;