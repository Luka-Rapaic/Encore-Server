class NumberDye {
    #value = null;

    roll() {
        this.#value = Math.floor(Math.random() * 6);
    }

    getValue() {
        return this.#value;
    }
}

module.exports = NumberDye;