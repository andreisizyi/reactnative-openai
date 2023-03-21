class RateLimiter {
    start: number;
    state: boolean;
    dynamical: number;

    constructor(start = 30) {
        this.start = start;
        this.state = false;
        this.dynamical = this.start;
    }

    limit(func: Function) {
        return (...args: any) => {
            if (this.state) return;
            this.state = true;

            const result = func(...args);

            if (this.dynamical < 500) this.dynamical *= 1.05;
            setTimeout(() => {
                this.state = false;
            }, this.dynamical);

            return result;
        };

    }
}

export default RateLimiter;