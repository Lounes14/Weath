import React, { useState } from "react";
import { TextInput, Button, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const { colors } = useTheme();

  const handleSearch = () => {
    if (city) {
      onSearch(city);
      setCity(""); // Clear the input after search
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Entrez une ville"
        value={city}
        onChangeText={setCity}
        style={[styles.input, { backgroundColor: colors.background }]}
      />
      <Button title="Rechercher" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    marginVertical: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
});

export default SearchBar;
