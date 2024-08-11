import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

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

  const userId = '67f08475-9086-4848-9b86-a248933477da';

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
        <Text style={styles.cardTitle}>Карта для получения выплат</Text>
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{bonusCard.cardNumber}</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.balance}>{bonusCard.balance} ₽</Text>
          <Text style={styles.frozenBalance}>и {bonusCard.frozenBalance} ₽ в заморозке</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets copy/history.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>История операций</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets copy/recharge.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Пополнить баланс</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets copy/edit.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Изменить карту</Text>
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
          <Text style={styles.menuText}>Потратить баллы</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>О сервисе</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#59A9CC',
    margin: 10,
    padding: 20,
  },
  cardTop: {
    backgroundColor: '#58A6C8',
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
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardNumber: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBottom: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#58A6C8',
    marginBottom: 10,
  },
  balance: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  frozenBalance: {
    color: '#fff',
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
    backgroundColor: '#f9f9f9',
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
  },
  userPhone: {
    fontSize: 14,
    color: '#888',
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    position: 'relative',
    justifyContent: 'center',
  },
  progress: {
    width: '85%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#59A9CC',
  },
  progressText: {
    position: 'absolute',
    right: 10,
    fontSize: 12,
    color: '#fff',
  },
  balanceContainer: {
    padding: 15,
    backgroundColor: '#fff',
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
  },
  frozenText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menu: {
    padding: 15,
    backgroundColor: '#fff',
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
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default UserProfile;
