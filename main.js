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
     * @param {obj} obj - Objeto que contiene las palabras a sugerir
     * @param {boolean} [index=false] - Indice para obtener los valores del objeto
     */
    constructor(input, obj, index = false) {
        this.input = document.querySelector(input)
        this.obj = obj
        this.index = index
        this.words = (this.index === false) ? this.obj : this.getIndexValues()
        this.main()
    }

    /**
     * Obtiene los valores del objeto a partir del indice especificado
     * @param {obj} [obj=this.obj] - Objeto a buscar los valores
     * @returns {Array} - Array con los valores encontrados
     */
    getIndexValues(obj = this.obj) {
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
        this.letters.forEach((letter, idx) => {
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
        words.forEach((word, idx) => response.push(this.normalizeWord(word)));
        return response;
    }

    /**
     * Método para manejar el evento de clic en los resultados de la búsqueda. 
     * Verifica si el elemento clickeado es un elemento LI, y en caso afirmativo, selecciona el elemento.
     * @param {Event} event - El evento de click en los resultados de la búsqueda.
     */
    handleResultClick(event) {
        if (event.target && event.target.nodeName === "LI") {
            this.selectItem(event.target);
        }
    }

    /**
     * Método para seleccionar un elemento de los resultados de la búsqueda. 
     * Asigna el valor del elemento seleccionado al input y esconde los resultados.
     * @param {HTMLElement} node - El elemento seleccionado de los resultados de la búsqueda.
     */
    selectItem(node) {
        if (node) {
            this.input.value = node.innerText;
            this.hideResults();
        }
    }

    /**
     * Método para esconder los resultados de la búsqueda. 
     * Limpia el contenido HTML del contenedor y agrega la clase 'hidden'.
     */
    hideResults() {
        this.container.innerHTML = "";
        this.container.classList.add("hidden");
    }

    /**
     * Método para insertar HTML con los resultados de la búsqueda. 
     * Crea una lista de elementos LI para cada resultado de la búsqueda y los une en un string. 
     * Luego, asigna ese string como contenido HTML del contenedor. 
     * Finalmente, quita la clase 'hidden' del contenedor para mostrar los resultados de la búsqueda.
     * @param {Array} posibles - Los resultados de la búsqueda normalizados y ordenados.
     */
    insertHTML (posibles) {
        this.container.innerHTML = posibles.map((result, index) => {
            const isSelected = index === 0;
            return `
                <li
                id='autocomplete-result-${index}'
                class='autocomplete-result${isSelected ? " selected" : ""}'
                role='option'
                ${isSelected ? "aria-selected='true'" : ""}
                >
                ${result}
                </li>
            `;
        }).join("")

        this.container.classList.remove("hidden");
    }

    /**
     * Realiza una búsqueda entre las palabras previamente normalizadas
     * @param {Event} e - Evento de teclado o cambio en el input
     * @returns {Array} posibles - Arreglo con las palabras que coinciden con la búsqueda
     */
    search(e) {
        let key = this.input.value
        let posibles = []
        if (key.length > 0) {
            key = this.normalizeWord(key); // Normaliza la palabra clave
            this.words.forEach(function (word, idx) {
                if (word.normal.indexOf(key.normal) !== -1) posibles.push(word.original); // Agrega a la lista de posibles resultados
            });
        }
        this.insertHTML(posibles)
    }

    /**
     * Método principal para ejecutar la lógica de la clase SuggestWord.
     * Crea un elemento UL y lo inserta después del input en el DOM.
     * Normaliza y ordena las palabras de la lista de palabras.
     * Agrega un evento de clic al contenedor de resultados para manejar el seleccionado de un resultado.
     * Agrega un evento de entrada al input para buscar resultados.
     */
    main() {
        this.container = document.createElement("ul")
        const parentElement = this.input.parentElement
        parentElement.insertBefore(this.container, this.input.nextSibling)

        this.words = this.normalizeWords(this.words);
        this.words.sort(this.sortNormalizedWords);
        this.container.addEventListener("click", (event) => {this.handleResultClick(event)})
        this.input.addEventListener('input', (e) => this.search(e))
    }
}