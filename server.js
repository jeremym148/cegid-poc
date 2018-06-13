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


const callCegid = async (method, bodyReq) => {
    var url = `${process.env.ENDPOINT}`;
    var POST = { method: 'POST', headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'Accept': 'text/xml',
        'Cache-Control': 'no-cache',
        'SOAPAction': `${process.env.SOAP_ACTION}${method}`,
        'Authorization': `Basic ${process.env.AUTH}`
        },
        body: BodyReqUtils.GetBody(method, bodyReq) 
    };
    
    try{
        var result = await fetch(`${url}`,POST)

        if(result.ok != true){
            var err = new Error(`${result.status} ${result.statusText}`);
            throw err;
        }
        result = await result.text()
        let resultObj = Wsdlrdr.getXmlDataAsJson(result);
        return BodyParseResUtils.GetBodyParsedRes(method, resultObj, bodyReq);

    } catch(err){
        console.log(err)
        throw err;
    }
    
}

var setItemObj = (AvailableQtyByItemByStore, stockObj, itemCode) =>{
    var obj =  R.mergeAll(AvailableQtyByItemByStore)
    var arr = [];
    if (R.type(obj.StoresAvailableQty) == "Object"){
        arr = [R.dissoc('AvailableSkusQty', R.mergeAll(obj.StoresAvailableQty.StoreAvailableQty))];
    }
    else if (R.type(obj.StoresAvailableQty) == "Array"){
        arr = obj.StoresAvailableQty.map(item =>{
            return R.dissoc('AvailableSkusQty', R.mergeAll(item.StoreAvailableQty));
        })
    }
    return R.assoc(itemCode, arr,stockObj);
}


app.post('/:myFunction', async function(req, res){
    var body = req.body;
    res.set('Content-Type', 'application/json');
    try{
        var data = await callCegid(req.params.myFunction,body);
        res.send(data);
    } catch(err){
        console.log(err)
        res.statusMessage = err.message;
        res.sendStatus(500);
    }
    
});



app.listen( port, function () {
    console.log( 'Express server listening on port ' + port );
} );


