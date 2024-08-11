import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Импортируйте useNavigation

const dates = [1, 4, 5, 6, 9, 10, 15, 21, 22, 24, 27, 28, 29, 30]; 
const events = {
  1: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  4: ['- Поставка кирпичей в объеме 10000 шт.', '- Поставка щебня в объеме 1 т.', '- Поставка песка в объеме 10 т.'],
  5: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  6: ['- Поставка древесины в объеме 10 т.', '- Поставка цемента в объеме 15 т.', '- Поставка воды в объеме 1000 т.'],
  9: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  10: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  15: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  21: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  22: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  24: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  27: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  28: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  29: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
  30: ['- Поставка песка в объеме 10 т.', '- Поставка щебня в объеме 1 т.', '- Поставка кремня в объеме 5 т.'],
};

export default function Home() {
  const navigation = useNavigation(); // Инициализация навигации

  const [selectedDate, setSelectedDate] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const handleDatePress = (date) => {
    if (selectedDate === date) {
      setExpanded(!expanded);
    } else {
      setSelectedDate(date);
      setExpanded(true);
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const heightAnim = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 40, marginBottom: 20, backgroundColor: 'white', borderRadius: 10, padding: 10}}>
          <Image source={require('../../assets copy/new_logo.png')} />
          <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <View style={{marginRight: 15}}>
              <Image source={require('../../assets copy/Notification.png')} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}> 
              <Image
                source={require('../../assets copy/avatar_chat1.jpg')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Задачи</Text>
          <View style={styles.separator} />
          <View style={styles.row}>
            <View style={styles.mailBox}>
              <Text style={styles.mailCountText}>4</Text>
              <Text style={styles.labelText}>Новые сообщения</Text>
            </View>
            <View style={styles.mailBox}>
              <Text style={styles.overdueText}>2</Text>
              <Text style={styles.labelText}>Просроченные</Text>
            </View>
          </View>
        </View>

        <View style={styles.mailSection}>
          <Text style={styles.sectionTitle}>Почта</Text>
          <View style={styles.separator_blue} />
          <View style={styles.mailBox}>
            <Text style={styles.mailCountText}>4</Text>
            <Text style={styles.labelText}>Новые сообщения</Text>
          </View>
        </View>

        <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 20, marginTop: 10 }]}>Календарь - август 2024</Text>
          <View style={styles.calendar}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[styles.dateBox, selectedDate === date && styles.selectedDateBox]}
                onPress={() => handleDatePress(date)}
              >
                <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Animated.View style={[styles.eventContainer, { height: heightAnim }]}>
            <View style={styles.eventList}>
              {selectedDate ? (
                events[selectedDate]?.map((event, index) => (
                  <Text key={index} style={styles.eventText}>{event}</Text>
                ))
              ) : (
                <Text style={styles.eventText}>Выберите дату</Text>
              )}
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: 45,  // Установите необходимую ширину
    height: 45, // Установите необходимую высоту
    resizeMode: 'cover', // Или 'contain', 'stretch' в зависимости от того, как вы хотите отобразить изображение
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  mailSection: {
    marginBottom: 20,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  mailBox: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFA726',
    marginVertical: 15,
  },
  separator_blue: {
    width: '100%',
    height: 2,
    backgroundColor: '#7889B4',
    marginVertical: 15,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dateBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  selectedDateBox: {
    backgroundColor: '#FFA726',
  },
  dateText: {
    fontSize: 18,
    color: '#666',
  },
  selectedDateText: {
    color: 'white',
  },
  eventContainer: {
    overflow: 'hidden',
  },
  eventList: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  noEventText: {
    fontSize: 18,
    color: '#999',
  },
  mailCountText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#66BB6A',
  },
  labelText: {
    fontSize: 14,
    color: '#666',
  },
  overdueText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
  },
});