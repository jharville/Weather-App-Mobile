import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

// Global variable to store timeout ID for the debounce function
let timer: NodeJS.Timeout;

// Debounce function: delays the execution of a function by a specified time (delay)
const debounce = (callbackFunction: (searchedCity: string) => void, delay: number) => {
  return (searchedCity: string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callbackFunction(searchedCity);
    }, delay);
  };
};

export const CustomAddressAutofill: React.FC<CustomAddressAutofillProps> = ({
  onAcceptedSuggestion,
  onNotSuggestionSubmit,
  searchedCity,
  children,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchedCity.trim()) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${searchedCity}&format=json&limit=5`,
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error Fetching Suggestions:', error);
          setSuggestions([]); // hides suggestions on error
        }
      } else {
        setSuggestions([]);
      }
    };

    // waits 500 ms before suggestions are fetched
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

    // invokes the debounced function
    debouncedFetchSuggestions(searchedCity);

    // cleans up the debounce
    return () => clearTimeout(timer);
  }, [searchedCity]);

  useEffect(() => {
    if (onNotSuggestionSubmit) {
      setSuggestions([]);
    }
  }, [onNotSuggestionSubmit]);

  const renderItem = useCallback(({item, index}: {item: Suggestion; index: number}) => {
    return (
      <TouchableOpacity onPress={() => onAcceptedSuggestion?.(item.display_name)}>
        <Text
          style={[
            styles.suggestionText,
            index !== suggestions.length - 1 ? styles.suggestionDivider : null,
          ]}>
          {item.display_name}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <>
      {children}
      {suggestions.length > 0 && (
        <View style={styles.resultContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderItem}
            keyExtractor={item => item.place_id}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    borderWidth: 4,
    borderColor: '#00f0f8',
    borderRadius: 8,
    backgroundColor: '#333',
    paddingHorizontal: 10,
    color: 'white',
    fontFamily: 'Roboto',
  },

  resultListItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#00f0f884',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },

  suggestionText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 8,
  },

  suggestionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#00f0f884',
  },

  lastResultListItem: {
    borderBottomWidth: 0,
  },
});

interface Suggestion {
  place_id: string;
  display_name: string;
}

interface CustomAddressAutofillProps {
  onAcceptedSuggestion?: (suggestion: string) => void;
  onNotSuggestionSubmit?: () => void;
  searchedCity: string;
  children?: React.ReactNode;
}
