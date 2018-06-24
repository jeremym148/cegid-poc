var https = require('https');
var fs = require('fs');
var fetch = require('node-fetch');
var express = require('express');
var bodyParser = require('body-parser')
const Wsdlrdr = require('wsdlrdr');
const R = require('ramda');
var BodyReqUtils = require('./BodyReqUtils');
var BodyParseResUtils = require('./BodyParseResUtils');

var app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var port = process.env.PORT || 8080;


const callCegid = async (service ,method, bodyReq) => {
    var url = `${process.env.ENDPOINT}${service}.svc`;
    var POST = { method: 'POST', headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'Accept': 'text/xml',
        'Cache-Control': 'no-cache',
        'SOAPAction': `${process.env.SOAP_ACTION}I${service}/${method}`,
        'Authorization': `Basic ${process.env.AUTH}`
        },
        body: BodyReqUtils.GetBody(method, bodyReq) 
    };
    
    try{
        var result = await fetch(`${url}`,POST)

        if(result.ok != true){
            result = await result.text()
            let resultObj = Wsdlrdr.getXmlDataAsJson(result);
            var err = new Error(`${resultObj.Fault[1].faultstring}`);
            throw err;
        }
        result = await result.text()
        let resultObj = Wsdlrdr.getXmlDataAsJson(result);
        let returnObj = BodyParseResUtils.GetBodyParsedRes(method, resultObj, bodyReq);
        return returnObj != null ? returnObj : resultObj;

    } catch(err){
        console.log(err)
        throw err;
    }
    
}



app.post('/:myService/:myFunction', async function(req, res){
    var body = req.body;
    res.set('Content-Type', 'application/json');
    try{
        var data = await callCegid(req.params.myService, req.params.myFunction, body);
        res.send(data);
    } catch(err){
        res.status(500).send({ error: err.message });
        // res.sendStatus(500).send(err.message);
    }
    
});



app.listen( port, function () {
    console.log( 'Express server listening on port ' + port );
} );


