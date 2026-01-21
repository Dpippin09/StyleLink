import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const handleContactUs = () => {
    Alert.alert('Contact Us', 'Feature coming soon!');
  };

  const handleAbout = () => {
    Alert.alert('About StyleLink', 'StyleLink helps you find the best shoe prices across all major retailers. Never overpay for shoes again!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your StyleLink experience</Text>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>About StyleLink</Text>
              <Text style={styles.menuDescription}>Learn about our shoe price comparison service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleContactUs}>
            <Ionicons name="mail-outline" size={24} color="#007AFF" />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Contact Us</Text>
              <Text style={styles.menuDescription}>Get help or send feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuDescription}>Manage notifications and preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>1. Search for Shoes</Text>
            <Text style={styles.infoDescription}>
              Enter any shoe brand, model, or style to find the best prices
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>2. Compare Prices</Text>
            <Text style={styles.infoDescription}>
              We search across major retailers like Amazon, Nike, Adidas, and more
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>3. Get Price Alerts</Text>
            <Text style={styles.infoDescription}>
              Add shoes to your watchlist and get notified when prices drop
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>4. Shop with Confidence</Text>
            <Text style={styles.infoDescription}>
              Click through to buy directly from trusted retailers
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
