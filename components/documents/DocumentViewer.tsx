import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';

export default function DocumentViewer({ document }) {
  if (!document) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Документ не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{document.name}</Text>
      </View>
      <HTML
        source={{ html: document.content }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    width: '100%',  // Обеспечивает, чтобы HTML занимал всю ширину контейнера
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
