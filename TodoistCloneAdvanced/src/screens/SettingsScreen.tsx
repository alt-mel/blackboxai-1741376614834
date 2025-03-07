import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const SettingItem = ({
    icon,
    title,
    value,
    onValueChange,
    type = 'switch',
  }: {
    icon: string;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <Icon name={icon} size={24} color="#666" style={styles.settingIcon} />
      <Text style={styles.settingTitle}>{title}</Text>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#ddd', true: '#db4c3f' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="bell-outline"
          title="Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <SettingItem
          icon="weather-night"
          title="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <SettingItem
          icon="volume-high"
          title="Sound Effects"
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.button}>
          <Icon name="account-outline" size={24} color="#666" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="shield-outline" size={24} color="#666" />
          <Text style={styles.buttonText}>Privacy Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.button}>
          <Icon name="help-circle-outline" size={24} color="#666" />
          <Text style={styles.buttonText}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="email-outline" size={24} color="#666" />
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#db4c3f',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    padding: 16,
  },
});

export default SettingsScreen;
