/**
 * Copyright (c) 2018 D. Dante Lorenso <dante@lorenso.com>.  All Rights Reserved.
 * This source file is subject to the MIT license that is bundled with this package
 * in the file LICENSE.txt.  It is also available at: https://opensource.org/licenses/MIT
 *
 * Quick utilty class to aid tracking time.
 *
 * TODO: instead of checking for elapsed time, maybe we can set a timeout and just update the data at intervals.
 */
var Timer = /** @class */ (function () {
    /**
     * Start timer.
     */
    function Timer() {
        this.start_time = 0;
        this.tick_time = 0;
        this.start_time = new Date().getTime();
        this.tick_time = this.start_time;
    }
    /**
     * @returns {number}
     */
    Timer.prototype.getRuntime = function () {
        return (new Date().getTime() - this.start_time) / 1000;
    };
    /**
     * How much time has elapsed since our tick marker?
     * @returns {number}
     */
    Timer.prototype.getTicktime = function () {
        return (new Date().getTime() - this.tick_time) / 1000;
    };
    /**
     * Set a temp tick marker.
     */
    Timer.prototype.markTicktime = function () {
        this.tick_time = new Date().getTime();
    };
    return Timer;
}());
//# sourceMappingURL=Timer.js.map