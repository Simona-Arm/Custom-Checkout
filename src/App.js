import "./App.css";
import {InstantSearch, SearchBox, useHits} from "react-instantsearch";

import {TYPESENSE_SERVER_CONFIG, typesenseInstantsearchAdapter} from "./scripts/typesenseadapter.js";
import {ReactComponent as SearchIcon} from './assets/icons/searchIcon.svg';
import {useEffect, useState} from "react";
import {Hits} from "react-instantsearch";
import Hit from "./components/Hit";

async function performSearch(query,setResults,searchClient) {

    if (query.trim() === '') {
        setResults([]);
        return;
    }
    try {
        const searchResults = await searchClient.searchClient.search('name', {
            q: query,
        });
        setResults(searchResults.hits || []);
    } catch (error) {
        console.error('Typesense search error:', error);
        setResults([]);
    }
}



function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);


  return (
    <div className="App">
      <InstantSearch searchClient={typesenseInstantsearchAdapter.searchClient} indexName="test">
          <header className="header">
              <div>
                  <SearchIcon />
                  <SearchBox
                      className="ais-SearchBox"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                  />
              </div>

          </header>
          <main>
              <Hit/>
          </main>
      </InstantSearch>
    </div>
  );
}

export default App;
