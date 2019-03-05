module.exports = function main(distance, waitingTime) {
    const INITIATE_PRICE = 6,
          UNIT_PRICE = 0.8,
          CHARGE = UNIT_PRICE * 0.5,
          WAITING_PRICE = 0.25,
          INITIATE_DESTANCE = 2,
          CHARGE_DESTANCE = 8;

    let totalFee = 0;
        

    if(distance <= INITIATE_DESTANCE) {
        totalFee = INITIATE_PRICE + waitingTime * WAITING_PRICE;
    } else if (distance >= INITIATE_DESTANCE && distance <= CHARGE_DESTANCE) {
        totalFee = INITIATE_PRICE + (distance - INITIATE_DESTANCE) * UNIT_PRICE + waitingTime * WAITING_PRICE;
    } else {
        totalFee = INITIATE_PRICE + (distance - INITIATE_DESTANCE) * UNIT_PRICE + (distance - CHARGE_DESTANCE) * CHARGE + waitingTime * WAITING_PRICE;
    }

    return Math.round(totalFee);
};
