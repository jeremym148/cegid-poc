module.exports = {
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
                    <ns:DatabaseId>FASHION_ED2015</ns:DatabaseId>
                </ns:clientContext>
            </ns:GetListItemInventoryDetailByStore>
        </soapenv:Body>
    </soapenv:Envelope>`}
}