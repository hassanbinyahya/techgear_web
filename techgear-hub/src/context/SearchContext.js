import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setAllProducts(response.data || []);
      } catch (error) {
        console.error('Failed to load products for search suggestions:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery || !allProducts.length) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allProducts
      .filter(product => product?.name && product.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);

    setSearchResults(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [allProducts, searchQuery]);

  const searchProducts = (query) => {
    setSearchQuery(query || '');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const selectProduct = (product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      showSuggestions,
      searchProducts,
      clearSearch,
      selectProduct,
      allProducts
    }}>
      {children}
    </SearchContext.Provider>
  );
};