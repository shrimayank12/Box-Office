import React,{ useState, useCallback } from 'react'
import ActorGrid from '../components/actor/ActorGrid';
import CustomRadio from '../components/CustomRadio';
import MainPageLayout from '../components/MainPageLayout'
import ShowGrid from '../components/show/ShowGrid';
import { apiGet } from '../misc/config';
import { useLastQuery } from '../misc/custom-hooks';
import { RadioInputsWrapper, SearchButtonWrapper, SearchInput } from './Home.styled';

const renderResult = (results) => {
  if(results && results.length === 0){
    return <div>No Results</div>
  }
  if(results && results.length > 0){
    return results[0].show ?
       <ShowGrid data={results} />
      : <ActorGrid data={results} />
  }
  return null;
}

const Home = () => {
  const [input, setInput] = useLastQuery();
  const [results, setResults] = useState(null);
  const [searchOptions, setSearchOptions] = useState('shows');

  const isSearchShows = searchOptions === 'shows'

  const onSearch = () => {
    apiGet(`/search/${searchOptions}?q=${input}`).then(result => {
      setResults(result);
    })
  }

  const onInputChange = useCallback( ev => {
    setInput(ev.target.value)
  }, [setInput]) 

  const onKeyDown = (ev) => {
    if(ev.keyCode === 13)
      onSearch()
  }

  const onRadioChange = useCallback( ev => {
    setSearchOptions(ev.target.value);
  }, [])

  return (
    <MainPageLayout>
      <SearchInput type='text' 
        placeholder='Search for Something'
        onChange={onInputChange} 
        onKeyDown={onKeyDown} 
        value={input}
      />
      <RadioInputsWrapper>
        <div>
          <CustomRadio 
            label='Shows'
            id='shows-search' 
            value='shows' 
            checked={isSearchShows} 
            onChange={onRadioChange} 
          />
        </div>
        
        <div>
          <CustomRadio 
            label='Actors'
            id='actors-search' 
            value='people' 
            checked={!isSearchShows}
            onChange={onRadioChange} 
          />
        </div>
      </RadioInputsWrapper>
      <SearchButtonWrapper>
        <button type='button' onClick={onSearch}>Search</button>
      </SearchButtonWrapper>
      {renderResult(results)}
    </MainPageLayout>
  )
}

export default Home