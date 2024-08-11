import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

const initialTasks = [
  { id: 1, title: 'Документ 001', responsible: 'Иван Иванов', status: 'Поступили' },
  { id: 2, title: 'Документ 002', responsible: 'Петр Петров', status: 'Поступили' },
  { id: 3, title: 'Документ 003', responsible: 'Сергей Сергеев', status: 'Приняты к обработке' },
  { id: 4, title: 'Документ 004', responsible: 'Андрей Андреев', status: 'Подписаны' },
];

const TaskItem = ({ task, onCheck }) => (
  <View style={styles.taskItem}>
    <Checkbox
      status={task.checked ? 'checked' : 'unchecked'}
      onPress={() => onCheck(task)}
    />
    <View style={styles.taskInfo}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskResponsible}>Ответственный: {task.responsible}</Text>
    </View>
  </View>
);

const TaskTabs = ({ activeTab, setActiveTab }) => (
  <View style={styles.segmentedControl}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'Поступили' && styles.activeTab]}
      onPress={() => setActiveTab('Поступили')}
    >
      <Text style={[styles.tabText, activeTab === 'Поступили' && styles.activeTabText]}>Поступили</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'Приняты к обработке' && styles.activeTab]}
      onPress={() => setActiveTab('Приняты к обработке')}
    >
      <Text style={[styles.tabText, activeTab === 'Приняты к обработке' && styles.activeTabText]}>Приняты к обработке</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'Подписаны' && styles.activeTab]}
      onPress={() => setActiveTab('Подписаны')}
    >
      <Text style={[styles.tabText, activeTab === 'Подписаны' && styles.activeTabText]}>Подписаны</Text>
    </TouchableOpacity>
  </View>
);

const TasksScreen = () => {
  const [activeTab, setActiveTab] = useState('Поступили');
  const [tasks, setTasks] = useState(initialTasks);

  const handleCheck = (task) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        if (t.status === 'Поступили') {
          return { ...t, status: 'Приняты к обработке' };
        } else if (t.status === 'Приняты к обработке') {
          return { ...t, status: 'Подписаны' };
        }
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => task.status === activeTab);

  return (
    <ScrollView style={styles.container}>
      <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            onCheck={handleCheck}
          />
        ))
      ) : (
        <Text style={styles.noTasksText}>Нет документов в этом разделе.</Text>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#8e24aa', // Фиолетовый цвет
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    backgroundColor: '#6a1b9a', // Фиолетовый цвет
    borderRadius: 20,
  },
  tabText: {
    color: '#6a1b9a', // Фиолетовый цвет
    fontWeight: 'bold',
    fontSize: 12,
  },
  activeTabText: {
    color: '#fff',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  taskInfo: {
    marginLeft: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskResponsible: {
    fontSize: 14,
    color: '#888',
  },
  noTasksText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default TasksScreen;
