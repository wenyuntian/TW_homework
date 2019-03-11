let database = require('./datbase.js');

module.exports = function printInventory(inputs) {
    const shoppingInformations = {
        goodsInformations: new Map(),
        promotionInformations: new Map()
    }

    getGoodsInformation(shoppingInformations, inputs);
    checkForDiscount(shoppingInformations, inputs);

    console.log(printShoppingList(shoppingInformations))
};

function printShoppingList(shoppingInformations) {
    let shoppingListString = '***<没钱赚商店>购物清单***\n';
    let [totalMoney, savedMoney] = [0, 0]
    
    shoppingInformations.goodsInformations.forEach((element) => {
        totalMoney += element.subtotal; 
        shoppingListString += `名称：${element.name}，数量：${element.account}${element.unit}，单价：${element.price.toFixed(2)}(元)，小计：${element.subtotal.toFixed(2)}(元)\n`
    });

    shoppingListString += '----------------------\n挥泪赠送商品：\n';

    shoppingInformations.promotionInformations.forEach((element) => {
        savedMoney += element.price; 
        shoppingListString += `名称：${element.name}，数量：${element.account}${element.unit}\n`
    })

    shoppingListString += `----------------------\n总计：${totalMoney.toFixed(2)}(元)\n节省：${savedMoney.toFixed(2)}(元)\n**********************`

    return shoppingListString;
}

function getGoodsInformation(shoppingInformations, inputs) {
    let allGoodsInformations = database.loadAllItems();

    inputs.forEach((item) => {
        allGoodsInformations.forEach((goodsItem) => {
            let [goodsId, goodsAccount = 1] = item.split('-');

            if(goodsId === goodsItem.barcode) {
                if(shoppingInformations.goodsInformations.has(goodsId)) {
                    let goodsInformation = shoppingInformations.goodsInformations.get(goodsId);
                    goodsInformation.account ++;
                    goodsInformation.subtotal += goodsInformation.price;
                } else {
                    shoppingInformations.goodsInformations.set(goodsId, {
                        account: goodsAccount,
                        subtotal: goodsItem.price * goodsAccount,
                        ... goodsItem
                    })
                }
            }
        }) 
    })
}

function checkForDiscount(shoppingInformations) {
    let Promotions = database.loadPromotions();
    let discountGoodsIds = Promotions[0].barcodes;
    let goodsInformations = shoppingInformations.goodsInformations;
    let promotionInformations = shoppingInformations.promotionInformations;

    discountGoodsIds.forEach((discountId) => {
        goodsInformations.forEach((goodsItem) => {
            if(goodsItem.barcode === discountId && goodsItem.account >= 2) {
                let promotionItem = {
                    ... goodsItem,
                    account: 1
                }
                goodsItem.subtotal -= goodsItem.price;
                promotionInformations.set(discountId, promotionItem);
            }
        })
    })
}