class SuggestWord {
    /**
     * Array de letras y su reemplazo
     * @type {Array}
     */
    letters = [
        { search: 'áäàãâ', replace: 'a' },
        { search: 'éëèê', replace: 'e' },
        { search: 'íïìî', replace: 'i' },
        { search: 'óöòõô', replace: 'o' },
        { search: 'úüùû', replace: 'u' },
        { search: 'ñ', replace: 'n' },
        { search: 'ç', replace: 'c' }
    ]

    /**
     * Contenedor del elemento
     */
    container = null

    /**
     * Constructor de la clase SuggestWord
     * @param {string} input - Seleccionador del elemento de entrada
     * @param {object} object - Objeto que contiene las palabras a sugerir
     * @param {boolean} [index=false] - Indice para obtener los valores del objeto
     */
    constructor(input, object, index = false) {
        this.input = document.querySelector(input)
        this.object = object
        this.index = index
        this.words = (this.index === false) ? this.object : this.getIndexValues()
        this.main()
    }

    /**
     * Obtiene los valores del objeto a partir del indice especificado
     * @param {object} [obj=this.object] - Objeto a buscar los valores
     * @returns {Array} - Array con los valores encontrados
     */
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

    /**
     * Ordena las palabras normalizadas
     * @param {object} a - Palabra a
     * @param {object} b - Palabra b
     * @returns {number} - Resultado de la comparación
     */
    sortNormalizedWords(a, b) {
        return (a.normal > b.normal) ? 1 : (a.normal < b.normal) ? -1 : 0
    }

    /**
     * Ordena las palabras por tamaño
     * @param {string} a - Palabra a
     * @param {string} b - Palabra b
     * @returns {number} - Resultado de la comparación
     */
    sortShortWords(a, b) {
        return (a.length > b.length) ? 1 : (a.length < b.length) ? -1 : 0
    }

    /**
     * Método que normaliza una palabra convirtiendo todas las letras a minúsculas y reemplazando caracteres especiales por sus equivalentes en minúsculas.
     * @param {string} word - La palabra a normalizar
     * @returns {Object} Un objeto con dos propiedades: "original" que contiene la palabra original y "normal" que contiene la palabra normalizada.
     */
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

    /**
     * Normaliza las palabras en el arreglo.
     * @param {Array} words - El arreglo de palabras que se desea normalizar.
     * @returns {Array} - El arreglo de palabras normalizadas.
     */
    normalizeWords(words) {
        let response = [];
        words.forEach((word, idx) => response.push(normalizeWord(word.Bezeichnung)));
        return response;
    }

    /**
     * Realiza una búsqueda entre las palabras previamente normalizadas
     * @param {Event} e - Evento de teclado o cambio en el input
     * @returns {Array} posibles - Arreglo con las palabras que coinciden con la búsqueda
     */
    search(e) {
        let key = this.input.value, posibles = []
        if (key.length > 0) {
            key = this.normalizeWord(key); // Normaliza la palabra clave
            this.words.forEach(function (word, idx) {
                if (word.normal.indexOf(key.normal) !== -1) posibles.push(word.original); // Agrega a la lista de posibles resultados
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