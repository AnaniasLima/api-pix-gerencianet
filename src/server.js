if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

const cert = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
    pfx: cert,
    passphrase:''
});

const credentials = Buffer.from(
    `${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`
).toString('base64');

axios({
    method: 'POST',
    url:`${process.env.GN_ENDPOINT}/oauth/token`,
    headers:{
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
        grant_type : 'client_credentials'
    }
}).
then((response) => {
    const accessToken = response.data?.access_token;


    const reqGN = axios.create({
        baseURL:process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });


    const dataCob = {
        calendario: {
            expiracao: 3600
        },
        valor: {
            original: '100.00'
        },
        chave: 'd984518b-f4d6-199b-053c-23c043dbff28',
        solicitacaoPagador: 'Cobrança de teste.'
    };

    reqGN.post('v2/cob', dataCob).then((response) => console.log(response.data));
});
//then(console.log);

//console.log(cert);

/*
curl --request POST \
  --url https://api-pix-h.gerencianet.com.br/oauth/token \
  --header 'Authorization: Basic Q2xpZW50X0lkX2M4MzRiNTY2NDZjMjVkM2ExNDg2MjEzNjk0NWZkOTBlMTEzNzkxMDg6Q2xpZW50X1NlY3JldF9mZGE3ZTRlZjA2Y2Q4NDMxOTg4ODU0ZGY0MzhhNWI4NTc5ODcxOGY4' \
  --header 'Content-Type: application/json' \
  --data '{
	"grant_type": "client_credentials"
}'

*/