import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.navigate('Home')}
        style={styles.backButton}
      />
      <Button mode="contained" onPress={() => navigation.navigate('DocumentListScreen')}>
        Список документов
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('TemplateSelectionScreen')} style={styles.button}>
        Создать новый документ
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    position: 'relative', // Ensure the container is positioned relatively to place the backButton correctly
  },
  button: {
    marginTop: 16,
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 1,
  },
});

export default HomeScreen;
