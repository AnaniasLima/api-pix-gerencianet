if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const express = require('express');
const GNRequest = require('./apis/gerencianet')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.get('/', async (req, res) => {
    

    const reqGN = await GNRequest();

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

    const cobResponse = await reqGN.post('v2/cob', dataCob);
    
    // res.send(cobResponse.data);

    const qrcodeResponse = await reqGN.get(`/V2/loc/${cobResponse.data.loc.id}/qrcode`);
    res.render('qrcode', {qrcodeImage: qrcodeResponse.data.imagemQrcode});

//    const qrcodeResponse = await reqGN.get('/V2/pix?inicio=2020-10-22T16:01:35Z&2021-10-22T16:01:35Z&txid=123012345678901234');
  //  res.send(qrcodeResponse.data);


});

app.listen(8000, () => {
    console.log('running');
})