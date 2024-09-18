import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Card, IconButton, Checkbox } from 'react-native-paper';

const Todo = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTask = async () => {
    if (task.trim() === '') return;

    await AsyncStorage.setItem('tasks', JSON.stringify([...tasks, { text: task, completed: false }]));

    // Update state
    setTasks([...tasks, { text: task, completed: false }]);
    setTask('');
  };

  const deleteTask = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const toggleTaskCompletion = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <View style={styles.container}>
        <Text style={styles.headerText}> Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a task"
            placeholderTextColor="#A4A4A4"
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <IconButton
            icon="plus-box-multiple-outline"

            color="#2C82E6"
            size={20}
            onPress={saveTask}
          />
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Card style={[styles.taskCard, { backgroundColor: item.completed ? '#f0bcb9' : '#FFFFFF' }]}>
              <View style={styles.taskContainer}>
                <Checkbox.Android
                  status={item.completed ? 'checked' : 'unchecked'}
                  onPress={() => toggleTaskCompletion(index)}
                  color="#E44D3A"
                />
                <Text style={[styles.taskText, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
                  {item.text}
                </Text>
                <IconButton
                  icon="delete-outline"
                  color="#E44D3A"
                  size={24}
                  onPress={() => deleteTask(index)}
                />
              </View>
            </Card>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F4F4F4',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:12
  },
  input: {
    width: '80%',
    color: '#333',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 10,
    fontSize: 14,
    padding:5
  },
  taskCard: {
    marginVertical: 3,
    borderRadius: 8,
    elevation: 3,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: '#333',
  },
});

export default Todo;
