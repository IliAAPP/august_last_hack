import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { key: 'home', label: 'Главная', icon: 'home' },
    { key: 'map', label: 'Карта', icon: 'map' },
    { key: 'tasks', label: 'Задания', icon: 'assignment' },
    { key: 'chats', label: 'Чаты', icon: 'chat' },
    { key: 'profile', label: 'Профиль', icon: 'person' },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => setActiveTab(tab.key)}
        >
          <MaterialIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? '#59A9CC' : '#C4C4C4'}
          />
          <Text style={{ color: activeTab === tab.key ? '#59A9CC' : '#C4C4C4' }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  tab: {
    alignItems: 'center',
  },
});

export default Footer;
