import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, IconButton } from 'react-native-paper';
import { useAtom } from 'jotai';
import { documentsAtom } from '../atoms/documentsAtom';
import { fetchDocuments } from '../api/documents';

interface Document {
  id: string;
  type: string;
  fields: Record<string, string>;
}

interface DocumentListScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const DocumentListScreen = ({ navigation }: DocumentListScreenProps) => {
  const [documents, setDocuments] = useAtom(documentsAtom);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.fields.name || 'Unnamed Document'}
            description={item.type}
            onPress={() => navigation.navigate('DocumentEditScreen', { documentId: item.id })}
          />
        )}
      />
      <IconButton
        icon="arrow-left"
        color="purple"
        size={24}
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.backButton}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('TemplateSelectionScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DocumentListScreen;
