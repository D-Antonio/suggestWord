# suggestWord
this class only needs the input with which the word is entered and the list of words to be filtered.
~~~ js
listWords = [
  "key 1",
  "key 2",
  "key 3",
  ...
  "key n"
]
~~~
~~~ js
selector = "body > div > input[type=text]"
~~~
~~~ js
new SuggestWord(
  selector,
  listWords,
)
~~~

## [example](https://suggest-word.vercel.app/)

in this example I will filter pokemon names by consuming [pokeapi](https://pokeapi.co/)

~~~ js
async function getPokemons(limit) {
    let datos = null;
    await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`).then(function (response) {
        return response.json();
    }).then(function (data) {
        datos = data.results;
    }).catch(function (e) {
        console.warn(e);
    });
    return datos;
}
~~~
`getPokemons(3)` this function will return the following object, where the name of three pokemon is shown 
~~~ JSON
{
  "count": 1279,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=4&limit=4",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    {
      "name": "venusaur",
      "url": "https://pokeapi.co/api/v2/pokemon/3/"
    }
  ]
}
~~~
in my case I am going to filter only the "name", so I must specify to the class which will be the index to search for
~~~ js
document.addEventListener('DOMContentLoaded', async function () {
    let obj = await getPokemons(1000);
    new SuggestWord(
      '#entrada', 
      obj, 
      'name' // the index to search for
    ) 
}, false); 
~~~
[Click me to view demo](https://suggest-word.vercel.app/)
