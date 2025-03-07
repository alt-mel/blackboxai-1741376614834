import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Task } from '../../types/Task';

interface PriorityButtonProps {
  level: Task['priority'];
  selected: boolean;
  onPress: (level: Task['priority']) => void;
}

const getPriorityColor = (level: number) => {
  switch (level) {
    case 1:
      return '#ff0000';
    case 2:
      return '#ffa500';
    case 3:
      return '#0000ff';
    default:
      return '#808080';
  }
};

const PriorityButton: React.FC<PriorityButtonProps> = ({ level, selected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.priorityButton,
      selected && { backgroundColor: getPriorityColor(level) }
    ]}
    onPress={() => onPress(level)}
  >
    <Icon
      name="flag"
      size={20}
      color={selected ? '#fff' : getPriorityColor(level)}
    />
    <Text style={[
      styles.priorityText,
      selected && { color: '#fff' }
    ]}>
      P{level}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: '23%',
    justifyContent: 'center',
  },
  priorityText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default PriorityButton;
