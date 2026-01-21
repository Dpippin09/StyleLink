import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const POPULAR_SEARCHES = [
  'Nike Air Max',
  'Adidas Ultraboost',
  'Converse Chuck Taylor',
  'Vans Old Skool',
  'Jordan 1',
  'New Balance 990',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Please enter a shoe to search for');
      return;
    }
    // TODO: Navigate to search results
    console.log('Searching for:', searchQuery);
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Navigate to search results
    console.log('Popular search:', query);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>STYLELINK</Text>
          <Text style={styles.tagline}>Find the best shoe prices</Text>
          <Text style={styles.tagline}>across all retailers.</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for shoes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Searches */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.popularGrid}>
            {POPULAR_SEARCHES.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularItem}
                onPress={() => handlePopularSearch(search)}
              >
                <Text style={styles.popularText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Use StyleLink?</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="search-circle" size={24} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Best Prices Found</Text>
              <Text style={styles.featureDescription}>
                We compare prices across all major shoe retailers instantly
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Price Alerts</Text>
              <Text style={styles.featureDescription}>
                Get notified when prices drop on your favorite shoes
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="link" size={24} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Trusted Links</Text>
              <Text style={styles.featureDescription}>
                Direct links to official retailers with secure checkout
              </Text>
            </View>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  popularSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularItem: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  popularText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  featureText: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
