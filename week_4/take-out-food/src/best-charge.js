function bestCharge(selectedItems) {
  let allFoodItems = loadAllItems();
  let promotions = loadPromotions();
  let orderDetail = {
    foodInformationList: new Map(),
    promotionList: [],
    totalMoney: 0,
    savedMoney: 0
  }

  buildFoodInformationList(selectedItems, allFoodItems, orderDetail);
  buildDiscountInformationList(promotions, orderDetail);

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
  let selectedObjects = validateInput(selectedItems);

  selectedObjects.forEach((selectedItem) => {
    let {
      itemId,
      itemAmount
    } = selectedItem;

    allFoodItems.forEach((foodItem) => {
      if (itemId === foodItem.id) {
        orderDetail.foodInformationList.set(itemId, {
          amount: itemAmount,
          ...foodItem
        })
        orderDetail.totalMoney += foodItem.price * itemAmount;
      }
    })
  })
}

// 满30减6元
function FullReductionPromotion(promotions, orderDetail) {

  if (orderDetail.totalMoney >= 30) {
    orderDetail.promotionList.push({
      type: promotions[0].type,
      discounts: 6,
      note: ''
    })
  }
}

// 指定商品半价
function halfPricePromotion(promotions, orderDetail) {
  let promotionItems = promotions[1].items;
  let discounts = 0;
  let note = '';

  orderDetail.foodInformationList.forEach((foodInformation, foodId) => {
    promotionItems.forEach((promotionItem) => {
      if (promotionItem === foodId) {
        discounts += foodInformation.amount * foodInformation.price * 0.5;
        note += (note ? `，${foodInformation.name}` : foodInformation.name);
      }
    })
  })

  orderDetail.promotionList.push({
    type: promotions[1].type,
    discounts: discounts,
    note: note
  })
}

function buildDiscountInformationList(promotions, orderDetail) {

  FullReductionPromotion(promotions, orderDetail);
  halfPricePromotion(promotions, orderDetail);

  sortPromotionList(orderDetail.promotionList);
  buildBillImformation(orderDetail);
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
