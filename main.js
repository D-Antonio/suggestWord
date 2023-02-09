class SuggestWord {
    letters = [
        { search: 'áäàãâ', replace: 'a' },
        { search: 'éëèê', replace: 'e' },
        { search: 'íïìî', replace: 'i' },
        { search: 'óöòõô', replace: 'o' },
        { search: 'úüùû', replace: 'u' },
        { search: 'ñ', replace: 'n' },
        { search: 'ç', replace: 'c' }
    ]

    container = null

    constructor(input, object, index = false) {
        this.input = document.querySelector(input)
        this.object = object
        this.index = index
        this.words = (this.index === false) ? this.object : this.getIndexValues()
        this.main()
    }

    getIndexValues(obj = this.object) {
        let result = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if (typeof element === "object") {
                    result = result.concat(this.getIndexValues(element));
                } else if (key === this.index) {
                    result.push(element);
                }
            }
        }
        return result;
    }

    sortNormalizedWords(a, b) {
        return (a.normal > b.normal) ? 1 : (a.normal < b.normal) ? -1 : 0
    }

    sortShortWords(a, b) {
        return (a.length > b.length) ? 1 : (a.length < b.length) ? -1 : 0
    }

    normalizeWord(word) {
        word = word.toLowerCase();
        let normal = word;
        letters.forEach((letter, idx) => {
            let re = new RegExp('[' + letter.search + ']', 'g');
            normal = normal.replace(re, letter.replace);
        });
        return {
            original: word,
            normal: normal
        };
    }

    normalizeWords(words) {
        let response = [];
        words.forEach((word, idx) => response.push(normalizeWord(word.Bezeichnung)));
        return response;
    }

    search(e) {
        let key = this.input.value, posibles = []
        if (key.length > 0) {
            key = normalizeWord(key);
            this.words.forEach(function (word, idx) {
                if (word.normal.indexOf(key.normal) !== -1) {
                    posibles.push(word.original);

                    if (key.original === word.original) {
                        lucky = word.original;
                    }

                    else if (!lucky && key.normal === word.normal) {
                        lucky = word.normal;
                    }
                }
            });
        }
    }

    main() {
        this.container = document.createElement("div")
        const parentElement = this.input.parentElement
        parentElement.insertBefore(this.container, this.input)

        this.words = this.normalizeWords(this.words);
        this.words.sort(this.sortNormalizedWords);
        this.input.addEventListener('input', this.search)
    }
}