import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDocument } from '../api/documents';

interface DocumentFields {
  [key: string]: string;
}

interface Document {
  id: string;
  type: string;
  fields: DocumentFields;
}

interface DocumentViewScreenProps {
  route: {
    params: {
      documentId: string;
    };
  };
}

const DocumentViewScreen = ({ route }: DocumentViewScreenProps) => {
  const { documentId } = route.params;
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      const doc = await getDocument(documentId);
      setDocument(doc);
    };
    loadDocument();
  }, [documentId]);

  if (!document) return null;

  return (
    <ScrollView style={styles.container}>
      {Object.entries(document.fields).map(([key, value]) => (
        <View key={key} style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{key.replace('_', ' ').toUpperCase()}:</Text>
          <Text>{value}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
});

export default DocumentViewScreen;
