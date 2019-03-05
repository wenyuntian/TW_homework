const main = require('../main/main');

describe('taxi fee', function () {
    it ('should give ￥6 when the distance <= 2km and wait 0 minute', () => {
        let distance = 1.5;
        let waitingTime = 0;
        let result = main(distance, waitingTime)

        expect(result).toBe(6)
    })

    it('should give ￥7 when the distance <= 2km and wait 5.5 minute', () => {
        let distance = 1.5;
        let waitingTime = 5.5;
        let result = main(distance, waitingTime)

        expect(result).toBe(7)
    })

    it('should give ￥11 when the distance >= 2km and distance <= 8 and wait 5.5 minute', () => {
        let distance = 6.5;
        let waitingTime = 5.5;
        let result = main(distance, waitingTime)

        expect(result).toBe(11)
    })

    it('should give ￥18 when the distance > 8km and wait 5.5 minute', () => {
        let distance = 12.8;
        let waitingTime = 5.5;
        let result = main(distance, waitingTime)

        expect(result).toBe(18)
    })
});
