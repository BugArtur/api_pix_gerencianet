

if(process.env.NODE_ENV !== 'production'){

    require('dotenv').config()

}
const axios = require('axios');
const fs = require('fs')
const path = require('path')
const https = require('https')

const cert = fs.readFileSync(
    path.resolve(__dirname, `../certificados/${process.env.GN_CERT}`)
)

const agent = new https.Agent({
    pfx: cert,
    passphrase: '',
})

let credentials = process.env.GN_CLIENT_ID + ':' + process.env.GN_CLIENT_SECRET;
let auth = Buffer.from(credentials).toString('base64');


// const credentials = Buffer.from(
//     `${process.env.GN_CLIENT_ID}: ${process.env.GN_CLIENT_SECRET}`
// ).toString('base64')



    axios({
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
    
    }).catch((e)=>{
            console.log(e)
    }).then((response)=>{

        const acessToken =  response.data?.access_token;

        const reqGN =  axios.create({
            baseURL: process.env.GN_ENDPOINT,
            httpsAgent: agent,
            headers:{
                Authorization: `Bearer ${acessToken}`,
                'Content-Type' : 'application/json'
            }
        })


        const dataCob = {
            calendario: {
              expiracao: 3600,
            },
            valor: {
              original: "100.00"
            },
            chave: "71cdf9ba-c695-4e3c-b010-abb521a3f1be",
            solicitacaoPagador: "Informe o número ou identificador do pedido."
          }

        reqGN.post("/v2/cob", dataCob).catch((e)=>{console.log(e)}).then((response)=>{console.log(response.data)})

    })
    
    


// curl --request POST \
//   --url https://api-pix-h.gerencianet.com.br/oauth/token \
//   --header 'Authorization: Basic Q2xpZW50X0lkXzA5ZTliZTRhNGYxMTcxNmU1MDY5MDI4NTI5ZTM3NGZmMmJiNzQ2YWQ6Q2xpZW50X1NlY3JldF85ZTgzOTk0NGFhZDk5YWRhNmVjOTYzMTJlYWJiZGYyNjJhMzg4MjNh' \
//   --header 'Content-Type: application/json' \
//   --data '{
// 	"grant_type": "client_credentials"
// }'