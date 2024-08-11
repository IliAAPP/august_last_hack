import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { createDocument } from '../api/documents';

const templates = [
  { name: 'Договор', type: 'contract' },
  { name: 'Смета', type: 'estimate' },
  { name: 'Подряд', type: 'work_order' },
];

interface TemplateSelectionScreenProps {
  navigation: any; // Можно уточнить тип, если используете навигацию с типизацией
}

const TemplateSelectionScreen = ({ navigation }: TemplateSelectionScreenProps) => {
  const handleTemplateSelection = async (type: string) => {
    const newDocument = await createDocument(type);
    navigation.navigate('DocumentEditScreen', { documentId: newDocument.id });
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        color="purple"
        size={24}
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.backButton}
      />
      {templates.map((template) => (
        <Button
          key={template.type}
          mode="contained"
          onPress={() => handleTemplateSelection(template.type)}
          style={styles.button}
        >
          {template.name}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  button: {
    marginBottom: 16,
  },
});

export default TemplateSelectionScreen;
