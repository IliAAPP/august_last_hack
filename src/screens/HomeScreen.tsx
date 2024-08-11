import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
  },
  button: {
    marginTop: 16,
  },
});

export default HomeScreen;