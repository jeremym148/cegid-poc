const R = require('ramda');
const moment = require('moment');

module.exports = {
    //------------------------------------------------------------------------------------------------------------------------------------//
 
    GetBody: (method,body) =>{
        switch(method) {
            case 'GetListItemInventoryDetailByStore':
                return module.exports.GetListItemInventoryDetailByStore(body);
            case 'UpdateShoppingCart':
                return module.exports.UpdateShoppingCart(body);
            case 'ResetShoppingCart':
                return module.exports.ResetShoppingCart(body);
            case 'Create':
                return module.exports.Create(body);
            default:
                return null
        }

    },
    //------------------------------------------------------------------------------------------------------------------------------------//

    GetListItemInventoryDetailByStore : (body) =>{
        var referencesElements =``
        body.references.map(ref => {
            referencesElements += 
            `<ns:ItemIdentifier>
                <ns:Reference>${ref}</ns:Reference>
            </ns:ItemIdentifier>`
         })

        var storesElements =``
        body.stores.map(store => {
            storesElements += `<arr:string>${store}</arr:string>`
         })

        return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cegid.fr/Retail/1.0" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                    <soapenv:Header />
                    <soapenv:Body>
                        <ns:GetListItemInventoryDetailByStore>
                            <ns:inventoryStoreItemDetailRequest>
                                <ns:AllAvailableWarehouse>true</ns:AllAvailableWarehouse>
                                <ns:DetailSku>true</ns:DetailSku>
                                <ns:ItemIdentifiers>
                                ${referencesElements}
                                </ns:ItemIdentifiers>
                                <ns:OnlyAvailableStock>true</ns:OnlyAvailableStock>
                                <ns:StoreIds>
                                <!--Zero or more repetitions:-->
                                ${storesElements}
                                </ns:StoreIds>
                                <ns:WithStoreName>true</ns:WithStoreName>
                            </ns:inventoryStoreItemDetailRequest>
                            <ns:clientContext>
                                <ns:DatabaseId>${process.env.DATABASE_ID}</ns:DatabaseId>
                            </ns:clientContext>
                        </ns:GetListItemInventoryDetailByStore>
                    </soapenv:Body>
                </soapenv:Envelope>`
    }, 

    //------------------------------------------------------------------------------------------------------------------------------------//

    UpdateShoppingCart : (body) =>{
        return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cegid.fr/Retail/1.0">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <ns:UpdateShoppingCart>
                        <ns:request>
                            <ns:ItemIdentifier>
                                <ns:Reference>${body.reference}</ns:Reference>
                            </ns:ItemIdentifier>
                            <ns:Quantity>${body.quantity}</ns:Quantity>
                            <ns:WarehouseId>${process.env.WAREHOUSE_ID}</ns:WarehouseId>
                        </ns:request>
                        <ns:clientContext>
                            <ns:DatabaseId>${process.env.DATABASE_ID}</ns:DatabaseId>
                        </ns:clientContext>
                    </ns:UpdateShoppingCart>
                    </soapenv:Body>
                </soapenv:Envelope>`
    },

    //------------------------------------------------------------------------------------------------------------------------------------//

    ResetShoppingCart : (body) =>{
        return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cegid.fr/Retail/1.0">
                    <soapenv:Header/>
                    <soapenv:Body>
                    <ns:ResetShoppingCart>
                        <ns:request>
                            <ns:ItemIdentifier>
                                <ns:Reference>${body.reference}</ns:Reference>
                            </ns:ItemIdentifier>
                            <ns:WarehouseId>${process.env.WAREHOUSE_ID}</ns:WarehouseId>
                        </ns:request>
                        <ns:clientContext>
                            <ns:DatabaseId>${process.env.DATABASE_ID}</ns:DatabaseId>
                        </ns:clientContext>
                    </ns:ResetShoppingCart>
                    </soapenv:Body>
                </soapenv:Envelope>`
    },

    //------------------------------------------------------------------------------------------------------------------------------------//

    Create : (body) =>{
        var referencesElements =``
        body.references.map(ref => {
            referencesElements += 
            `<ns:Create_Line>
                <!--Optional:-->
        
                <!--Optional:-->
                <ns:ItemIdentifier>
                <!--Optional:-->
                <ns:Reference>${ref.id}</ns:Reference>
                </ns:ItemIdentifier>
                <!--Optional:-->
        
                <!--Optional:-->
                <ns:Quantity>${ref.quantity}</ns:Quantity>
                <!--Optional:-->
                <ns:SalesPersonId>A.BERLUTI</ns:SalesPersonId>
                <!--Optional:-->
                <ns:UnitPrice>${ref.unitPrice}</ns:UnitPrice>
            </ns:Create_Line>`
         })

        return `<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.cegid.fr/Retail/1.0">
           <soapenv:Header/>
           <soapenv:Body>
              <ns:Create>
                 <ns:createRequest>
                    <ns:Header>
                       <ns:CustomerId>FR0010007700</ns:CustomerId>
                            <ns:Date>${moment().format('YYYY-MM-DD')}</ns:Date>
        
                       <ns:InternalReference>FFA_ARTICLE${moment().unix()}</ns:InternalReference>
                       <!--Optional:-->
                       <ns:SalesPersonId>A.BERLUTI</ns:SalesPersonId>
                       <!--Optional:-->
                       <ns:StoreId>${body.store}</ns:StoreId>
                       <!--Optional:-->
                       <ns:Type>ReceiptOnHold</ns:Type>
                    </ns:Header>
                   <ns:Lines>
                       <!--Zero or more repetitions:-->
                       ${referencesElements}
                    </ns:Lines>
        
                 </ns:createRequest>
                 <!--Optional:-->
                 <ns:clientContext>
                    <!--Optional:-->
                    <ns:DatabaseId>${process.env.DATABASE_ID}</ns:DatabaseId>
                 </ns:clientContext>
              </ns:Create>
           </soapenv:Body>
        </soapenv:Envelope>`
    }

}