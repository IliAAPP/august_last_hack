import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

interface BonusCard {
  cardNumber: string;
  balance: number;
  frozenBalance: number;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bonusCard, setBonusCard] = useState<BonusCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const userId = '67f08475-9086-4848-9b86-a248933477da';
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://10.2.0.152:3000/api/user/${userId}`);
        setUser({
          ...response.data,
          name: 'Илья Апполонов',
          phone: '+722809987654',
        });

        const bonusCardResponse = await axios.get(`http://10.2.0.152:3000/api/user/${userId}/bonus-card`);
        setBonusCard(bonusCardResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');  
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        await uploadAudio(uri);
      }
    }
  };

  const uploadAudio = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/wav',
      name: 'recording.wav',
    });
  
    try {
      console.log('Uploading audio file:', formData); // Log the formData for debugging
      const response = await axios.post('http://10.2.0.152:8000/transcribe-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data); // Log the server response
  
      const { data } = response;
      if (data.redirect) {
        const screenName = data.redirect.replace('.tsx', ''); // Remove .tsx if present
        navigation.navigate(screenName);
      } else {
        setTranscription(data.transcript);
      }
    } catch (error) {
      console.error('Error uploading audio:', error.response ? error.response.data : error.message);
    }
  };
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!user || !bonusCard) return <Text>No user or bonus card found</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={require('../../../assets copy/avatar_chat1.jpg')} style={styles.profileImage} />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Уровень 13</Text>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
          <Text style={styles.progressText}>1700 / 2000</Text>
        </View>
      </View>

      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>Зарплатная карта</Text>
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{bonusCard.cardNumber}</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.balance}>{bonusCard.balance} ₽</Text>
          <Text style={styles.frozenBalance}>и {bonusCard.frozenBalance} ₽ авансом</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets copy/history.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>История операций</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets copy/recharge.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Вывести деньги</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets copy/edit.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Изменить данные</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Экипировка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Договоры</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Инструкции</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Частые вопросы</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>О сервисе</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.menuText2}>Голосовой помощник - путеводитель:</Text>
      <View style={styles.voiceButtonContainer}>
        <TouchableOpacity
          style={[styles.voiceButton, isRecording ? styles.listening : styles.notListening]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          
          <Text style={styles.voiceButtonText}>
            {isRecording ? 'Остановить запись' : 'Начать запись'}
          </Text>
        </TouchableOpacity>
        <Text>Транскрипция: {transcription}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#6a1b9a', // Фиолетовый цвет
    margin: 10,
    padding: 20,
  },
  cardTop: {
    backgroundColor: '#8e24aa', // Фиолетовый цвет
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    paddingVertical: 10,
  },
  cardNumberContainer: {
    backgroundColor: '#f3e5f5', // Фиолетовый цвет
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardNumber: {
    color: '#6a1b9a', // Фиолетовый цвет
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBottom: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#8e24aa', // Фиолетовый цвет
    marginBottom: 10,
  },
  balance: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  frozenBalance: {
    color: '#f3e5f5', // Фиолетовый цвет
    fontSize: 16,
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white', // Фиолетовый цвет
    
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a1b9a', // Фиолетовый цвет
  },
  userPhone: {
    fontSize: 14,
    color: '#6a1b9a', // Фиолетовый цвет
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6a1b9a', // Фиолетовый цвет
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e1bee7', // Фиолетовый цвет
    position: 'relative',
    justifyContent: 'center',
  },
  progress: {
    width: '85%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#6a1b9a', // Фиолетовый цвет
  },
  progressText: {
    position: 'absolute',
    right: 10,
    fontSize: 12,
    color: '#fff',
  },
  balanceContainer: {
    padding: 15,
    backgroundColor: '#f3e5f5', // Фиолетовый цвет
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  balanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6a1b9a', // Фиолетовый цвет
  },
  frozenText: {
    fontSize: 14,
    color: '#6a1b9a', // Фиолетовый цвет
    marginBottom: 10,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menu: {
    padding: 15,
    backgroundColor: '#f3e5f5', // Фиолетовый цвет
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomColor: '#e1bee7', // Фиолетовый цвет
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a1b9a', // Фиолетовый цвет
  },
  menuText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a1b9a', // Фиолетовый цвет
  },
  userEmail: {
    fontSize: 14,
    color: '#6a1b9a', // Фиолетовый цвет
    marginTop: 5,
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    
  },
  voiceButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  listening: {
    backgroundColor: '#d32f2f', // Красный цвет для записи
  },
  notListening: {
    backgroundColor: '#4caf50', // Зеленый цвет для ожидания
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProfile;
