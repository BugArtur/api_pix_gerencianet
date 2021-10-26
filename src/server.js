

if(process.env.NODE_ENV !== 'production'){

    require('dotenv').config()

}

const GNRequest = require('./apis/gerencianet')
const express = require('express');
const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.json());

const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET,
});



app.set('views', 'src/views');
app.set('view engine', 'ejs');


app.get('/', async (req, res)=> {
        const reqGN = await reqGNAlready ;

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

        const cobResponse = await reqGN.post("/v2/cob", dataCob)

        const qrCodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)
        
        
        res.render('qrcode.ejs', { qrcodeImage: qrCodeResponse.data.imagemQrcode });

   
});
app.get('/cobrancas', async (req, res)=>{
  const reqGN = await reqGNAlready
  const listaCob = await reqGN.get('/v2/cob?inicio=2021-10-20T16:01:35Z&fim=2021-10-25T20:10:00Z')
  res.send(listaCob.data);
})

app.post('/webhooks(/pix)?', (req, res) =>{
  console.log(req.body);
  res.send('200')
})
app.listen(8000, ()=>{
    console.log('running')
})

    
    
    

