let database = require('./datbase.js');

module.exports = function printInventory(inputs) {
    const allItems = database.loadAllItems();
    const promotions = database.loadPromotions();

    const allItemMap = transformListToMap(allItems);
    const goodsInformationList = buildGoodsInformationList(inputs, allItemMap);
    const discountInformationList = buildDiscountInformationList(promotions, goodsInformationList);

    billInformation = {
        goodsInformationList: goodsInformationList,
        discountInformationList: discountInformationList
    }

    console.log(printBillInformation(billInformation));
};

function transformListToMap(allItems) {
    const allItemMap = new Map();
    
    allItems.forEach((item) => {
        allItemMap.set(item.barcode, item);
    })

    return allItemMap;
}

function buildGoodsInformationList(goodsList, allItemMap) {
    const goodsInformationList = new Map();

    goodsList.forEach((goodsItem) => {
        const [id, amount = 1] = goodsItem.split('-');
        const goodsInformation = goodsInformationList.get(id);

        if(goodsInformation) {
            goodsInformationList.set(id, {
                ...goodsInformation,
                amount: goodsInformation.amount + 1
            })
        } else {
            goodsInformationList.set(id, {
                ...allItemMap.get(id),
                amount: amount
            })
        }
    })

    return goodsInformationList;
}

function buildDiscountInformationList(promotions, goodsInformationList) {
    const discountInformationList = new Map();
    const promotionList = promotions[0].barcodes

    goodsInformationList.forEach((value, key) => {
        const isPromotion = (promotionList.indexOf(key) !== -1)
        const isFitAmount = (value.amount >= 2)

        if(isPromotion && isFitAmount) {
            discountInformationList.set(key, {
                ...value,
                amount: 1 
            })
        }
    })

    return discountInformationList;
}

function printBillInformation(billInformation) {
    let [totalMoney, savedMoney] = [0, 0];
    const {goodsInformationList, discountInformationList} = billInformation;
    
    let goodsInformationString = '';
    goodsInformationList.forEach((value, key) => {
        let subMoney = discountInformationList.has(key) ? (value.price * (value.amount - 1)) : (value.price * value.amount);
        totalMoney += subMoney;
        goodsInformationString += `名称：${value.name}，数量：${value.amount}${value.unit}，单价：${value.price.toFixed(2)}(元)，小计：${subMoney.toFixed(2)}(元)\n`;
    }) 

    let discountInformationString = '';
    discountInformationList.forEach((value, key) => {
        savedMoney += value.amount * value.price;

        discountInformationString += `名称：${value.name}，数量：${value.amount}${value.unit}\n`
    })

    return '***<没钱赚商店>购物清单***\n' +
            goodsInformationString + 
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            discountInformationString + 
            '----------------------\n' +
            `总计：${totalMoney.toFixed(2)}(元)\n` +
            `节省：${savedMoney.toFixed(2)}(元)\n` +
            '**********************';
}