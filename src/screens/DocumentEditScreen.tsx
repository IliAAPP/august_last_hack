import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { useAtom } from 'jotai';
import { documentsAtom } from '../atoms/documentsAtom';
import { getDocument, updateDocument } from '../api/documents';

interface Document {
  id: string;
  type: string;
  fields: Record<string, string>;
}

interface DocumentEditScreenProps {
  route: {
    params: {
      documentId: string;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

const DocumentEditScreen = ({ route, navigation }: DocumentEditScreenProps) => {
  const { documentId } = route.params;
  const [documents] = useAtom(documentsAtom);
  const [document, setDocument] = useState<Document | null>(null);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      const doc = await getDocument(documentId);
      setDocument(doc);
      setFileName(doc.fields.name || ''); // Предполагается, что 'name' это поле для имени файла
    } catch (error) {
      console.error('Failed to load document:', error);
    }
  };

  const handleSave = async () => {
    if (document) {
      // Обновляем поле 'name' с новым значением имени файла
      const updatedDocument = {
        ...document,
        fields: { ...document.fields, name: fileName },
      };
      await updateDocument(documentId, { fields: updatedDocument.fields });
      navigation.goBack();
    }
  };

  if (!document) return null;

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Редактирование документа</Title>
      <TextInput
        label="Имя файла"
        value={fileName}
        onChangeText={setFileName}
        style={styles.input}
      />
      {Object.entries(document.fields).map(([key, value]) => (
        <TextInput
          key={key}
          label={key.replace('_', ' ').toUpperCase()}
          value={value}
          onChangeText={(text) => setDocument({
            ...document,
            fields: { ...document.fields, [key]: text }
          })}
          style={styles.input}
        />
      ))}
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Сохранить
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default DocumentEditScreen;

    