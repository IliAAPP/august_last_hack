import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
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
  button: {
    marginBottom: 16,
  },
});

export default TemplateSelectionScreen;
