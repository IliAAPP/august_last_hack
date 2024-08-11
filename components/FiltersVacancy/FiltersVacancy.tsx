import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const FiltersScreen = () => {
  const navigation = useNavigation();

  const [keywords, setKeywords] = useState('');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [location, setLocation] = useState('');
  const [hoursFrom, setHoursFrom] = useState(1);
  const [hoursTo, setHoursTo] = useState(12);
  const [selectedDay, setSelectedDay] = useState('ПН');
  const [sortOption, setSortOption] = useState('default');

  const onResetFilters = () => {
    setKeywords('');
    setSalaryFrom('');
    setSalaryTo('');
    setLocation('');
    setHoursFrom(1);
    setHoursTo(12);
    setSelectedDay('ПН');
    setSortOption('default');
  };

  const applyFilters = () => {
    const filters = {
      keywords,
      salaryFrom: salaryFrom ? parseFloat(salaryFrom) : null,
      salaryTo: salaryTo ? parseFloat(salaryTo) : null,
      location,
      hoursFrom,
      hoursTo,
      selectedDay,
      sortOption,
    };
  
    navigation.navigate('Map', { filters });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Фильтры</Text>
        <TouchableOpacity onPress={onResetFilters} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Ключевые слова, должность</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите текст..."
        value={keywords}
        onChangeText={setKeywords}
      />

      <Text style={styles.label}>Зарплата за смену</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          placeholder="От"
          value={salaryFrom}
          onChangeText={setSalaryFrom}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.inputHalf}
          placeholder="До"
          value={salaryTo}
          onChangeText={setSalaryTo}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Местоположение</Text>
      <TextInput
        style={styles.input}
        placeholder="Регион и/или город"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Часов в смене</Text>
      <View style={styles.row}>
        <Text>{hoursFrom}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={12}
          step={1}
          value={hoursFrom}
          onValueChange={setHoursFrom}
        />
        <Text>{hoursTo}</Text>
      </View>

      <Text style={styles.label}>Свободные дни</Text>
      <View style={styles.daysRow}>
        {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Сортировка по:</Text>
      <View style={styles.radioContainer}>
        {['default', 'date', 'lessSalary', 'moreSalary', 'distance'].map(option => (
          <View key={option} style={styles.radioOption}>
            <RadioButton
              value={option}
              status={sortOption === option ? 'checked' : 'unchecked'}
              onPress={() => setSortOption(option)}
            />
            <Text style={styles.radioLabel}>
              {option === 'default' && 'По умолчанию'}
              {option === 'date' && 'По дате'}
              {option === 'lessSalary' && 'Меньше зарплата'}
              {option === 'moreSalary' && 'Больше зарплата'}
              {option === 'distance' && 'По удалённости'}
            </Text>
          </View>
        ))}
      </View>

      <Button title="Подтвердить изменения" onPress={applyFilters} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'black',
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
  resetButton: {
    padding: 10,
  },
  resetButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  inputHalf: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  selectedDayButton: {
    backgroundColor: '#59A9CC',
  },
  dayText: {
    color: '#000',
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 10,
  },
});

export default FiltersScreen;
