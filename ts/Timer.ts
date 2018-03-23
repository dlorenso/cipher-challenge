/**
 * Copyright (C) 2018 D. Dante Lorenso <dante@lorenso.com> - All Rights Reserved
 *
 * Quick utilty class to aid tracking time.
 *
 * TODO: instead of checking for elapsed time, maybe we can set a timeout and just update the data at intervals.
 */
class Timer {
    private start_time:number = 0;
    private tick_time:number = 0;

    /**
     * Start timer.
     */
    constructor() {
        this.start_time = new Date().getTime();
        this.tick_time = this.start_time;
    }

    /**
     * @returns {number}
     */
    public getRuntime():number {
        return (new Date().getTime() - this.start_time) / 1000;
    }

    /**
     * How much time has elapsed since our tick marker?
     * @returns {number}
     */
    public getTicktime():number {
        return (new Date().getTime() - this.tick_time) / 1000;
    }

    /**
     * Set a temp tick marker.
     */
    public markTicktime() {
        this.tick_time = new Date().getTime();
    }
}
