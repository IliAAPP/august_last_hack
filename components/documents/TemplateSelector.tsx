// components/TemplateSelector.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAtom } from 'jotai';
import { templatesAtom } from '../../lib/atom';
import { newDocumentAtom } from '../../lib/atom';

import { createDocumentFromTemplate } from '../../lib/api';
import { Picker } from '@react-native-picker/picker';

const templates = [
  {
    id: 'contract',
    name: 'Договор',
    fields: [
      { name: 'contract_number', label: 'Номер договора', type: 'text' },
      { name: 'date', label: 'Дата договора', type: 'date' },
      { name: 'client_name', label: 'Наименование заказчика', type: 'text' },
      { name: 'contractor_name', label: 'Наименование исполнителя', type: 'text' },
      { name: 'contract_subject', label: 'Предмет договора', type: 'textarea' },
      { name: 'total_cost', label: 'Общая стоимость работ (руб.)', type: 'number' },
      { name: 'payment_terms', label: 'Условия оплаты', type: 'textarea' },
      { name: 'start_date', label: 'Дата начала работ', type: 'date' },
      { name: 'end_date', label: 'Дата окончания работ', type: 'date' },
      { name: 'responsibilities', label: 'Ответственность сторон', type: 'textarea' }
    ]
  },
  {
    id: 'estimate',
    name: 'Смета',
    fields: [
      { name: 'estimate_number', label: 'Номер сметы', type: 'text' },
      { name: 'date', label: 'Дата составления', type: 'date' },
      { name: 'project_name', label: 'Наименование проекта', type: 'text' },
      { name: 'items', label: 'Позиции сметы', type: 'items' },
      { name: 'total_cost', label: 'Итоговая стоимость (руб.)', type: 'number' }
    ]
  },
  {
    id: 'subcontract',
    name: 'Договор подряда',
    fields: [
      { name: 'subcontract_number', label: 'Номер договора', type: 'text' },
      { name: 'date', label: 'Дата договора', type: 'date' },
      { name: 'client_name', label: 'Наименование заказчика', type: 'text' },
      { name: 'subcontractor_name', label: 'Наименование подрядчика', type: 'text' },
      { name: 'subcontract_subject', label: 'Предмет договора', type: 'textarea' },
      { name: 'start_date', label: 'Дата начала работ', type: 'date' },
      { name: 'end_date', label: 'Дата окончания работ', type: 'date' },
      { name: 'total_cost', label: 'Общая стоимость работ (руб.)', type: 'number' },
      { name: 'payment_terms', label: 'Условия оплаты', type: 'textarea' },
      { name: 'rights_and_obligations', label: 'Права и обязанности сторон', type: 'textarea' },
      { name: 'responsibilities', label: 'Ответственность сторон', type: 'textarea' },
      { name: 'acceptance_procedure', label: 'Порядок сдачи-приемки работ', type: 'textarea' }
    ]
  },
];

export default function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [, setTemplates] = useAtom(templatesAtom);
  const [, setNewDocument] = useAtom(newDocumentAtom);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    setFormData({});
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: field === 'quantity' || field === 'cost' ? parseFloat(value) : value } : item
      )
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { name: '', unit: '', quantity: 0, cost: 0 }
      ]
    }));
  };

  const handleSubmit = async () => {
    try {
      const newDocument = await createDocumentFromTemplate(selectedTemplate, formData);
      setTemplates(prev => [...prev, newDocument]);
      setNewDocument(newDocument);
      Alert.alert('Документ создан', `Документ создан успешно с ID: ${newDocument.id}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать документ');
    }
  };

  const renderField = (field) => {
    if (field.type === 'items') {
      return (
        <View key={field.name} style={styles.fieldContainer}>
          <Text style={styles.label}>{field.label}</Text>
          {formData.items && formData.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <TextInput
                placeholder="Наименование"
                value={item.name}
                onChangeText={(value) => handleItemChange(index, 'name', value)}
                style={styles.input}
              />
              <TextInput
                placeholder="Ед. изм."
                value={item.unit}
                onChangeText={(value) => handleItemChange(index, 'unit', value)}
                style={styles.input}
              />
              <TextInput
                placeholder="Кол-во"
                value={item.quantity.toString()}
                onChangeText={(value) => handleItemChange(index, 'quantity', value)}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Стоимость"
                value={item.cost.toString()}
                onChangeText={(value) => handleItemChange(index, 'cost', value)}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          ))}
          <Button title="Добавить позицию" onPress={handleAddItem} />
        </View>
      );
    }

    return (
      <View key={field.name} style={styles.fieldContainer}>
        <Text style={styles.label}>{field.label}</Text>
        {field.type === 'textarea' ? (
          <TextInput
            value={formData[field.name] || ''}
            onChangeText={(value) => handleInputChange(field.name, value)}
            style={[styles.input, styles.textarea]}
            multiline
          />
        ) : (
          <TextInput
            value={formData[field.name] || ''}
            onChangeText={(value) => handleInputChange(field.name, value)}
            style={styles.input}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Picker
        selectedValue={selectedTemplate}
        onValueChange={(itemValue) => handleTemplateChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Выберите шаблон" value="" />
        {templates.map((template) => (
          <Picker.Item key={template.id} label={template.name} value={template.id} />
        ))}
      </Picker>

      {selectedTemplate && (
        <View style={styles.form}>
          {templates.find(t => t.id === selectedTemplate).fields.map(renderField)}
          <Button title="Создать документ" onPress={handleSubmit} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  form: {
    marginTop: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
});

