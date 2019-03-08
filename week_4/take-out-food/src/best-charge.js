function bestCharge(selectedItems) {
  let [discountCharge, fullCharge] = [0, 0];
  let promotions = loadPromotions();
  let allGoods = loadAllItems();

  let OrderDetails = "============= 订餐明细 =============\n";
  
  selectedItems.forEach(element => {
    let [goodsId, goodsCount] = element.split(' x ');
    let goodsDetail = getGoodsDetail(goodsId, goodsCount, allGoods);

    discountCharge += getDiscountPrice(goodsId, goodsCount, promotions, allGoods);
    fullCharge += goodsDetail.totalPrice;

    OrderDetails += `${goodsDetail.name} x ${goodsCount} = ${goodsDetail.totalPrice}元\n`
  });

  return printOrderDetails(discountCharge, fullCharge, OrderDetails);
}

function printOrderDetails(discountCharge, fullCharge, OrderDetails) {
  let fullReduceCharge = fullCharge >= 30 ? (fullCharge - 6) : fullCharge;

  if(discountCharge === fullCharge && fullReduceCharge === fullCharge) {
    OrderDetails += `-----------------------------------\n总计：${fullReduceCharge}元\n===================================`
  }
  else if(discountCharge > fullReduceCharge) {
    OrderDetails += `-----------------------------------\n使用优惠:\n满30减6元，省${fullCharge - fullReduceCharge}元\n-----------------------------------\n总计：${fullReduceCharge}元\n===================================`
  }
  else {
    OrderDetails += `-----------------------------------\n使用优惠:\n指定菜品半价(黄焖鸡，凉皮)，省${fullCharge - discountCharge}元\n-----------------------------------\n总计：${discountCharge}元\n===================================`
  }
  return OrderDetails;
}

function getDiscountPrice(goodsId, goodsCount, promotions, allGoods) {
  let discountGoods = promotions[1].items,
      discountPrice = getGoodsDetail(goodsId, goodsCount, allGoods).totalPrice;

  for (const index in discountGoods) {
    if(goodsId === discountGoods[index]) {
      discountPrice *= 0.5;
      break;
    }
  }

  return discountPrice;
}



function getGoodsDetail(goodsId, goodsCount=1, allGoods) {
  for(index in allGoods) {
    goods = allGoods[index];

    if(goodsId === goods.id) {
      return {
        totalPrice: goods.price * goodsCount,
        name: goods.name
      }
    }
  }
}
