import React, { useState } from 'react'
import { Searchbar } from 'react-native-paper';
import { styles } from '../styles/Stylesheet';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const onChangeSearch = query => setSearchQuery(query);
  return (
    <Searchbar
      placeholder="Search Leads"
      onChangeText={onChangeSearch}
      value={searchQuery}
      //search Bar Style mode
      mode='bar'
      //Search Bar Icons
      icon ='account-search'
      //search Loading
    //   loading
      //SearchBar Id
      testID = 'mainSearchBar'
      //Custom Style
      style={[styles.searchBar]}
      //Input Style
      inputStyle={[styles.searchBarInput]}
      //
      elevation ='1'
      clearIcon='close'
    />
  )
}

export default SearchBar