var https = require('https');
var fs = require('fs');
var fetch = require('node-fetch');
var express = require('express');
var bodyParser = require('body-parser')
const Wsdlrdr = require('wsdlrdr');
var app = express();
var GetListItemInventoryDetailByStore = require('./Utils').GetListItemInventoryDetailByStore
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// https.globalAgent.options.ca = rootCas;

// var rootCas = require('ssl-root-cas').create();
// https.globalAgent.options.ca = rootCas;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// var options = {
//     key: fs.readFileSync( './localhost.key' ),
//     cert: fs.readFileSync( './localhost.cert' ),
//     requestCert: false,
//     rejectUnauthorized: false
// };

var port = process.env.PORT || 8080;
// var server = https.createServer( options, app );

const callCegid = async (method, body) => {
    var url = 'https://y2-poc.lvmh.com/Y2-POC/ItemInventoryWcfService.svc';
    var POST = { method: 'POST', headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'Accept': 'text/xml',
        'Cache-Control': 'no-cache',
        'SOAPAction': `http://www.cegid.fr/Retail/1.0/IItemInventoryWcfService/${method}`,
        'Authorization': 'Basic RkFTSElPTl9FRDIwMTVcQ0VHSUQ6Q0VHSUQuMjAxNA== ' 
        },
        body: GetListItemInventoryDetailByStore(body) };
    
    try{
        var result = await fetch(`${url}`,POST)
        result = await result.text()
        return Wsdlrdr.getXmlDataAsJson(result);
    } catch(err){
        console.log(err)
    }
    
}


app.post('/:myFunction', async function(req, res){
    var body = req.body;
    console.log(body)
    res.set('Content-Type', 'application/json');
    var data = await callCegid(req.params.myFunction,body);
    res.send(data);
});



app.listen( port, function () {
    console.log( 'Express server listening on port ' + port );
} );
