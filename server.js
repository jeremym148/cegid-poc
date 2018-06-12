var https = require('https');
var fs = require('fs');
var fetch = require('node-fetch');
var express = require('express');
var bodyParser = require('body-parser')
const Wsdlrdr = require('wsdlrdr');
const R = require('ramda');
var app = express();
var GetListItemInventoryDetailByStore = require('./Utils').GetListItemInventoryDetailByStore
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var port = process.env.PORT || 8080;

class StoreStockwrapper{
    constructor(storeId, storeName, stock){
        this.storeId = storeId;
        this.storeName = storeName;
        this.stock = stock;
    }
}

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
        var stockObj = {};
        
        let resultObj = Wsdlrdr.getXmlDataAsJson(result);
        let InventoryDetailsByStore = resultObj
        .GetListItemInventoryDetailByStoreResponse
        .GetListItemInventoryDetailByStoreResult
        .InventoryDetailsByStore;

        if (R.type(InventoryDetailsByStore) == "Object"){
            stockObj = setItemObj(InventoryDetailsByStore.AvailableQtyByItemByStore,stockObj,body.references[0]);
        } 
        else if (R.type(InventoryDetailsByStore) == "Array"){
            InventoryDetailsByStore.map((itemStocks, index) => {
                stockObj = setItemObj(itemStocks.AvailableQtyByItemByStore, stockObj, body.references[index]);
            })
        }

        
        
        return stockObj;
    } catch(err){
        console.log(err);
    }
    
}

var setItemObj = (AvailableQtyByItemByStore, stockObj, itemCode) =>{
    var obj =  R.mergeAll(AvailableQtyByItemByStore)
    var arr = obj.StoresAvailableQty.map(item =>{
        return R.dissoc('AvailableSkusQty', R.mergeAll(item.StoreAvailableQty))
    })
    return R.assoc(itemCode, arr,stockObj);
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


