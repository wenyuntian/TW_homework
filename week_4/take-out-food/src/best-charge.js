function bestCharge(selectedItems) {
  let allFoodItems = loadAllItems();
  let promotions = loadPromotions();

  let {foodInformationList, totalMoney} = buildFoodInformationList(selectedItems, allFoodItems);
  let {promotionList, savedMoney} = buildDiscountInformationList(promotions, foodInformationList, totalMoney);

  let orderDetail = {
    foodInformationList: foodInformationList,
    promotionList: promotionList,
    totalMoney: totalMoney - savedMoney,
    savedMoney: savedMoney
  }
  return printOrderDetail(orderDetail);
}

function validateInput(selectedItems) {
  let selectedObjects = [];
  let regular = /^(ITEM\d{4}\sx\s\d)$/;

  selectedItems.forEach((selectedItem) => {
    if (regular.test(selectedItem)) {
      selectedObjects.push({
        itemId: selectedItem.split(' x ')[0],
        itemAmount: selectedItem.split(' x ')[1]
      })
    } else {
      throw new Error('Illegal input');
    }
  })
  return selectedObjects;
}

function sortPromotionList(PromotionList) {
  PromotionList.sort((prev, next) => {
    return next.discounts - prev.discounts;
  })
}

function buildBillImformation(orderDetail) {
  orderDetail.savedMoney = orderDetail.promotionList[0].discounts;
  orderDetail.totalMoney -= orderDetail.savedMoney;
}

function buildFoodInformationList(selectedItems, allFoodItems, orderDetail) {
  let foodInformationList = new Map();
  let totalMoney = 0;

  let selectedObjects = validateInput(selectedItems);

  selectedObjects.forEach((selectedItem) => {
    let {
      itemId,
      itemAmount
    } = selectedItem;

    allFoodItems.forEach((foodItem) => {
      if (itemId === foodItem.id) {
        foodInformationList.set(itemId, {
          amount: itemAmount,
          ...foodItem
        })
        totalMoney += foodItem.price * itemAmount;
      }
    })
  })

  return {foodInformationList, totalMoney}
}

// 满30减6元
function getFullReductionPromotion(promotions, totalMoney) {

  if (totalMoney >= 30) {
    return {
      type: promotions[0].type,
      discounts: 6,
      note: ''
    }
  }
}

// 指定商品半价
function getHalfPricePromotion(promotions, foodInformationList) {
  let promotionItems = promotions[1].items;
  let discounts = 0;
  let note = '';

  foodInformationList.forEach((foodInformation, foodId) => {
    promotionItems.forEach((promotionItem) => {
      if (promotionItem === foodId) {
        discounts += foodInformation.amount * foodInformation.price * 0.5;
        note += (note ? `，${foodInformation.name}` : foodInformation.name);
      }
    })
  })

  return {
    type: promotions[1].type,
    discounts: discounts,
    note: note
  }
}

function buildDiscountInformationList(promotions, foodInformationList, totalMoney) {
  let promotionList = [];
  let fullReductionPromotion = getFullReductionPromotion(promotions, totalMoney);
  let halfPricePromotion = getHalfPricePromotion(promotions, foodInformationList);

  promotionList.push(fullReductionPromotion, halfPricePromotion);
  sortPromotionList(promotionList);

  let savedMoney = promotionList[0].discounts;

  return {promotionList, savedMoney}
}

function printOrderDetail(orderDetail) {
  let {
    foodInformationList,
    promotionList,
    totalMoney,
    savedMoney
  } = orderDetail;
  let orderDetailString = '============= 订餐明细 =============\n';

  foodInformationList.forEach((foodItem) => {
    orderDetailString += `${foodItem.name} x ${foodItem.amount} = ${foodItem.amount * foodItem.price}元\n`
  })

  orderDetailString += savedMoney === 0 ? '' : `-----------------------------------\n使用优惠:\n${promotionList[0].type}${promotionList[0].note ? `(${promotionList[0].note})` : ''}，省${orderDetail.savedMoney}元\n`;
  orderDetailString += `-----------------------------------\n总计：${orderDetail.totalMoney}元\n===================================`

  return orderDetailString
}
