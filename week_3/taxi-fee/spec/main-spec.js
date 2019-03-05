const main = require('../main/main');

describe('taxi fee', function () {
    it ('should give ￥6 when the distance >= 2km and wait 0 minute', () => {
        let distance = 1.5;
        let waitingTime = 0;
        let result = main(distance, waitingTime)

        expect(result).toBe(6)
    })
});
