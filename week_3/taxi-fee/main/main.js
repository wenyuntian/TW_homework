module.exports = function main(distance, waitingTime) {
    let totalFee = 0;

    if(distance <= 2 && waitingTime === 0) {
        totalFee = 6
    } else if (distance >= 2 && waitingTime !== 0) {
        totalFee = 6 + (distance - 2) * 0.8 +  waitingTime * 0.25
    }

    return Math.round(totalFee);
};
