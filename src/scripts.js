// //wrapping in IIFE
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  /*Add single pokemon to pokemonList array. Before adding check whether the data type is object and whether the object contains
  the 'name' key. */
  function add(pokemon) {
    if (typeof pokemon === "object" && "name" in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  /*Return the whole pokemonList array. */
  function getAll() {
    return pokemonList;
  }

  //Add single pokemon item into the unordered list (pokemon-list class) on the index page as a button,
  //assign pokemon's name to the button and by clicking the button, log the name of the pokemon in console.
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listPokemon = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-class");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#modal");
    button.classList.add("col");
    listPokemon.classList.add("list-items");
    listPokemon.appendChild(button);
    pokemonList.appendChild(listPokemon);
    eventListener(button, pokemon);
  }

  function eventListener(button, pokemon) {
    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  //To fetch the pokemon list from the API and to add all the pokemon objects from the list into the pokemonList arrayvia calling the add function. Every pokemon object contains the name and detailsUrl keys
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //the loadDetails function (takes a pokeon as an argument) and loads the detailed data for a given pokemon (using the detailURL property)
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types.map((type) => type.type.name).join(",");
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetails(item) {
    loadDetails(item).then(function () {
      showModal(item);
    });
  }

  //Modal
  function showModal(pokemon) {
    let modalBody = $(".modal-body");
    let modalTitle = $(".modal-title");
  
    //clear existing content of the model
    modalBody.empty();
    modalTitle.empty();
    //creating element for name in modal content
    let title = $("<h1>" + pokemon.name + "</h1>");
    //creating img in modal content
    let pokemonImage = $("<img class= \"modal-img\" style=\"width:50%\">");
    pokemonImage.attr("src", pokemon.imageUrl);

    let pokemonHeight = $("<p>" + "height : " + pokemon.height + "</p>");
    //above added
    let pokemonWeight = $(
      "<p>" + "weight : " + pokemon.weight + "</p>"
    );

    let pokemonTypes = $("<p>" + "types : " + pokemon.types + "</p>");

    modalTitle.append(title);
    modalBody.append(pokemonImage);
    modalBody.append(pokemonHeight);
    modalBody.append(pokemonWeight);
    modalBody.append(pokemonTypes);
  }

  //return from the IIFE
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };

  //close the IIFE
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
