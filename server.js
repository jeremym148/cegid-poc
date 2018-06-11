var https = require('https');
var fs = require('fs');
var fetch = require('node-fetch');
var express = require('express');
var bodyParser = require('body-parser')
var soap = require('soap');
const EasySoap = require('easysoap');
var parse = require('xml-parser');
var app = express();
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

// https.globalAgent.options.ca = rootCas;

var rootCas = require('ssl-root-cas').create();
https.globalAgent.options.ca = rootCas;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var options = {
    key: fs.readFileSync( './localhost.key' ),
    cert: fs.readFileSync( './localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
};

var port = process.env.PORT || 8080;
var server = https.createServer( options, app );

//SOAP


// FETCH

const callCegig = (method,body) =>{

    var url = 'https://y2-poc.lvmh.com/Y2-POC/ItemInventoryWcfService.svc';
    var POST = { method: 'POST', headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'Accept': 'text/xml',
        'Cache-Control': 'no-cache',
        'SOAPAction': 'http://www.cegid.fr/Retail/1.0/IItemInventoryWcfService/'+ method,
        'Authorization': 'Basic RkFTSElPTl9FRDIwMTVcQ0VHSUQ6Q0VHSUQuMjAxNA== ' 
        },
        body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cegid.fr/Retail/1.0">
        <soapenv:Header/>
        <soapenv:Body>
           <ns:GetAvailableCumulativeQtyAllStores>
              <ns:itemIdentifier>
                 <ns:Reference>167793HSC.38NO</ns:Reference>
              </ns:itemIdentifier>
              <!--Optional:-->
              <ns:clientContext>
                 <!--Optional:-->
                 <ns:DatabaseId>FASHION_ED2015</ns:DatabaseId>
              </ns:clientContext>
           </ns:GetAvailableCumulativeQtyAllStores>
        </soapenv:Body>
     </soapenv:Envelope>` };
    
    
    fetch(`${url}`,POST)
    .then(res => res.text())
    .then(body => {
        return parse(body).root.children[0].children[0].children[0].children[0].content
    });
}


//EASY SOAP


app.post('/:method',function(req, res){
    var body = req.body;
    res.set('Content-Type', 'text/plain');
	res.send(callCegig(req.method, body));
});



app.get('/', function(req, res){
  res.send('bhhhhh');
});


server.listen( port, function () {
    console.log( 'Express server listening on port ' + server.address().port );
} );
