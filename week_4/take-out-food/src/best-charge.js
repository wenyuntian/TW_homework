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

function buildFoodInformationList(selectedItems, allFoodItems, orderDetail) {

  selectedItems.forEach((selectedItem) => {
    let [itemId, itemAmount] = selectedItem.split(' x ');

    allFoodItems.forEach((foodItem) => {
      if(itemId === foodItem.id) {
        orderDetail.foodInformationList.set(itemId, {
          amount: itemAmount,
          ... foodItem
        })
        orderDetail.totalMoney += foodItem.price * itemAmount;
      }
    })
  })
}

function buildDiscountInformationList(promotions, orderDetail) {
  // 满30减6元
  {
    if(orderDetail.totalMoney >= 30) {
      orderDetail.promotionList.push({
        type: promotions[0].type,
        discounts: 6,
        note: ''
      })
    }
  }

  // 指定菜品半价
  {
    let promotionItems = promotions[1].items;
    let discounts = 0;
    let note = '';

    orderDetail.foodInformationList.forEach((foodInformation, foodId) => {
      promotionItems.forEach((promotionItem) => {
        if(promotionItem === foodId) {
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

  orderDetail.promotionList.sort((prev, next) => {
    return next.discounts - prev.discounts;
  })

  orderDetail.savedMoney = orderDetail.promotionList[0].discounts;
  orderDetail.totalMoney -= orderDetail.savedMoney
}

function printOrderDetail(orderDetail) {
  let {foodInformationList, promotionList, totalMoney, savedMoney} = orderDetail;
  let orderDetailString = '============= 订餐明细 =============\n';

  foodInformationList.forEach((foodItem) => {
    orderDetailString += `${foodItem.name} x ${foodItem.amount} = ${foodItem.amount * foodItem.price}元\n`
  })

  orderDetailString += savedMoney === 0 ? '' : `-----------------------------------\n使用优惠:\n${promotionList[0].type}${promotionList[0].note ? `(${promotionList[0].note})` : ''}，省${orderDetail.savedMoney}元\n`;
  orderDetailString += `-----------------------------------\n总计：${orderDetail.totalMoney}元\n===================================`
  
  return orderDetailString
}