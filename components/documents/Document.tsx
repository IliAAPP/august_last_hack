import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Document() {
  const [documentType, setDocumentType] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    date: '',
    item: '',
    quantity: '',
    responsible: ''
  });
  const [showDocuments, setShowDocuments] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    setFormData({
      fullName: '',
      date: '',
      item: '',
      quantity: '',
      responsible: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleSubmitDocument = async () => {
    try {
      // Создаем объект данных для отправки на сервер
      const documentData = {
        fullName: formData.fullName,
        date: formData.date,
        details: documentType === 'type1'
          ? `Товар: ${formData.item} / Количество: ${formData.quantity}`
          : `Ответственный: ${formData.responsible}`
      };

      console.log('Отправляемые данные:', documentData); 

      const response = await fetch('http://10.2.0.152:8081/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (response.ok) {
        const data = await response.json();
        const url = `http://10.2.0.152:8081${data.pdf_url}`;

        setDocuments([...documents, { ...documentData, url }]);  
        setFormData({
          fullName: '',
          date: '',
          item: '',
          quantity: '',
          responsible: ''
        });
        setDocumentType('');
        Alert.alert('Успех', 'Документ успешно отправлен. Вы можете его скачать.');

        Linking.openURL(url);
      } else {
        const errorText = await response.text();
        Alert.alert('Ошибка', `Не удалось отправить документ: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить документ: ' + error.message);
      console.error(error);
    }
  };

  const handleShowDocuments = () => {
    setShowDocuments(true);
  };

  const handleReturnToForms = () => {
    setShowDocuments(false);
    setDocumentType('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Создание документа</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={showDocuments ? handleReturnToForms : handleShowDocuments}
        >
          <Text style={styles.buttonText}>{showDocuments ? 'Вернуться к шаблонам' : 'Мои документы'}</Text>
        </TouchableOpacity>
      </View>

      {showDocuments ? (
        <View style={styles.documentsContainer}>
          {documents.length === 0 ? (
            <Text style={styles.noDocuments}>Нет документов</Text>
          ) : (
            documents.map((doc, index) => (
              <View key={index} style={styles.document}>
                <Text>Документ {index + 1}:</Text>
                <Text>ФИО: {doc.fullName}</Text>
                <Text>Дата: {doc.date}</Text>
                <Text>{doc.details}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(doc.url)} style={styles.button}>
                  <Text style={styles.buttonText}>Скачать PDF</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      ) : (
        <>
          <Text style={styles.label}>Выберите тип документа</Text>
          <Picker
            selectedValue={documentType}
            style={styles.picker}
            onValueChange={handleDocumentTypeChange}
          >
            <Picker.Item label="Выберите тип документа" value="" />
            <Picker.Item label="Тип 1" value="type1" />
            <Picker.Item label="Тип 2" value="type2" />
          </Picker>

          <View style={styles.spacer} />

          {documentType === 'type1' && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Ваше ФИО</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите ваше ФИО"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
              <Text style={styles.label}>Дата</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите дату"
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
              />
              <Text style={styles.label}>Товар</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите товар"
                value={formData.item}
                onChangeText={(value) => handleInputChange('item', value)}
              />
              <Text style={styles.label}>Количество</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите количество"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
              />
              <TouchableOpacity onPress={handleSubmitDocument} style={styles.button}>
                <Text style={styles.buttonText}>Отправить данные в шаблон</Text>
              </TouchableOpacity>
            </View>
          )}

          {documentType === 'type2' && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Ваше ФИО</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите ваше ФИО"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
              <Text style={styles.label}>Дата</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите дату"
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
              />
              <Text style={styles.label}>Ответственный</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите ответственного"
                value={formData.responsible}
                onChangeText={(value) => handleInputChange('responsible', value)}
              />
              <TouchableOpacity onPress={handleSubmitDocument} style={styles.button}>
                <Text style={styles.buttonText}>Подписать документ</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 35
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#59A9CC',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  spacer: {
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  documentsContainer: {
    marginBottom: 20,
  },
  noDocuments: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  document: {
    marginBottom: 10,
  },
});
