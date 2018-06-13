const R = require('ramda');

module.exports = {
    //------------------------------------------------------------------------------------------------------------------------------------//
 
    GetBodyParsedRes: (method,result,bodyReq) =>{
        switch(method) {
            case 'GetListItemInventoryDetailByStore':
                return module.exports.GetListItemInventoryDetailByStore(bodyReq, result);
            case 'UpdateShoppingCart':
                return module.exports.UpdateShoppingCart(bodyReq, result);
            case 'ResetShoppingCart':
                return module.exports.ResetShoppingCart(bodyReq, result);
            default:
                return null
        }

    },
    //------------------------------------------------------------------------------------------------------------------------------------//

    GetListItemInventoryDetailByStore : (bodyReq, resultObj) =>{

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
        };


        var stockObj = {};
        let InventoryDetailsByStore = resultObj
        .GetListItemInventoryDetailByStoreResponse
        .GetListItemInventoryDetailByStoreResult
        .InventoryDetailsByStore;

        if (R.type(InventoryDetailsByStore) == "Object"){
            stockObj = setItemObj(InventoryDetailsByStore.AvailableQtyByItemByStore,stockObj,bodyReq.references[0]);
        } 
        else if (R.type(InventoryDetailsByStore) == "Array"){
            InventoryDetailsByStore.map((itemStocks, index) => {
                stockObj = setItemObj(itemStocks.AvailableQtyByItemByStore, stockObj, bodyReq.references[index]);
            })
        }
        return stockObj;
    }, 

    

    //------------------------------------------------------------------------------------------------------------------------------------//

    UpdateShoppingCart : (body) =>{

    },

    //------------------------------------------------------------------------------------------------------------------------------------//

    ResetShoppingCart : (body) =>{

    }
}