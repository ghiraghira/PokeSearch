import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Pokesearch.css';
import spark from './sparkles.gif';

const Pokesearch = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        setPokemonList(response.data.results);
        setDisplayedPokemon(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokémon results:', error);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    document.title = 'PokéSearcher';
  }, []);

  const fetchPokemonDetails = async (name) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching results for ${name}:`, error);
      return null;
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const filtered = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      const detailsPromises = filtered.map(async (pokemon) => {
        const details = await fetchPokemonDetails(pokemon.name);
        return details ? { ...details } : null;
      });
      const detailedPokemons = await Promise.all(detailsPromises);
      setDisplayedPokemon(detailedPokemons.filter(pokemon => pokemon));
    } else {
      setDisplayedPokemon(pokemonList);
    }
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption ? selectedOption.value : null);
  };

  const handleClearFilters = () => {
    setSelectedType(null);
  };

  useEffect(() => {
    const applyFilters = async () => {
      let filtered = pokemonList;

      if (searchQuery.length > 1) {
        filtered = filtered.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const detailsPromises = filtered.map(async (pokemon) => {
        const details = await fetchPokemonDetails(pokemon.name);
        return details ? { ...details } : null;
      });

      const detailedPokemons = await Promise.all(detailsPromises);
      let filteredPokemons = detailedPokemons.filter(pokemon => pokemon);

      if (selectedType) {
        filteredPokemons = filteredPokemons.filter(pokemon =>
          pokemon.types.some(type => type.type.name === selectedType)
        );
      }

      setDisplayedPokemon(filteredPokemons);
    };

    applyFilters();
  }, [searchQuery, selectedType, pokemonList]);

  const types = [
    { value: 'normal', label: 'Normal' },
    { value: 'fighting', label: 'Fighting' },
    { value: 'flying', label: 'Flying' },
    { value: 'poison', label: 'Poison' },
    { value: 'ground', label: 'Ground' },
    { value: 'rock', label: 'Rock' },
    { value: 'bug', label: 'Bug' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'steel', label: 'Steel' },
    { value: 'water', label: 'Water' },
    { value: 'grass', label: 'Grass' },
    { value: 'electric', label: 'Electric' },
    { value: 'psychic', label: 'Psychic' },
    { value: 'ice', label: 'Ice' },
    { value: 'dragon', label: 'Dragon' },
    { value: 'dark', label: 'Dark' },
    { value: 'fairy', label: 'Fairy' },
  ];

  const customTheme = (theme) => ({
    ...theme,
    borderRadius: 0,
    colors: {
      ...theme.colors,
      primary25: '#70103b',
      primary: 'white',     
      neutral0: '#ff1b82', 
      neutral5: 'white',    
      neutral20: 'white', 
      neutral50: 'white',    
      neutral80: 'white',  
    },
  });

  return (
    <div className={`Pokesearch ${selectedType ? `type-${selectedType}` : ''}`}>
      <div className='pokeTitle'>
        <img src={spark} alt='sparkles' className='sparkImg'/>
        <h1>Pokémon Search</h1>
        <img src={spark} alt='sparkles' className='sparkImg'/>
      </div>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search Pokémon by name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="filters">
        <Select className='selectTab'
          placeholder="Select Type"
          options={types}
          onChange={handleTypeChange}
          value={types.find(type => type.value === selectedType) || null}
          theme={customTheme}
        />
        <button onClick={handleClearFilters} className='clearButton'>Clear Search</button>
      </div>
      <div className="pokemonList">
        {displayedPokemon.map(pokemon => (
          <div key={pokemon.id} className={`pokemonItem type-${selectedType}`}>
            <img src={pokemon.sprites?.front_default || 'placeholder_image_url'} alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pokesearch;






