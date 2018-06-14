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
            // var isMatching = ( item, storeId )=> item.StoreId == storeId;

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
            var arrStores = bodyReq.stores.map( storeId => {
                return R.mergeDeepLeft(arr.filter(item => item.StoreId == storeId)[0], {StoreId: storeId, StoreName:storeId, AvailableQuantity: 0});
            })
            return R.assoc(itemCode, arrStores,stockObj);
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