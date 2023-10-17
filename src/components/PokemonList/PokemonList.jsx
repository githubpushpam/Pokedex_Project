import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css';
import Pokemon from "../pokemon/pokemon";

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function downloadPokemons() {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon'); // this dowmloads list of 20 pokemon.
    const pokemonResults = response.data.results; // pokemonResultPromise rteurns the array of pokemon details avilable on url
     
    // iterating over the array of pokemons, and using their url, to create an array of promise
    // that will download those 20 pokemon.
    const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
    // passing that promise array to axios.all
    const pokemonData = await axios.all(pokemonResultPromise);// array of 20 pokemon detailed data.    
    console.log(pokemonData);
    // now iterate on the data of each pokemon, and extract id, name, image, types.
    const pokeListResult = pokemonData.map((pokeData) => {
      const pokemon = pokeData.data;
      return {
        id:pokemon.id,
        name: pokemon.name,
        image: (pokemon.sprites) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
        types: pokemon.types
      }
    });
    console.log(pokeListResult);
    setPokemonList(pokeListResult);
    setIsLoading(false);

  }
  useEffect(() => {
    downloadPokemons();
  }, []);   // in this [] is dependency if you write empty []
  // it renders only in starting , if you don't write [] int renders all time
  // if you write something(variables) in [] then that value updates everytime


  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
      {(isLoading) ? 'Loading....' : 
         pokemonList.map((p) => < Pokemon name={p.name} image ={p.image} key={p.id}/>)
      }
      </div>
      <div className="controls">
        <button>prev</button>
        <button>next</button>
      </div>
     
    </div>

  )

}
export default PokemonList;