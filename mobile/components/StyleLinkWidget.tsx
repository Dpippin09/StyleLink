import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShoePrice {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  retailer: string;
  imageUrl: string;
}

interface WidgetProps {
  size: 'small' | 'medium' | 'large';
}

export default function StyleLinkWidget({ size }: WidgetProps) {
  const [priceAlerts, setPriceAlerts] = React.useState<ShoePrice[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadPriceAlerts();
  }, []);

  const loadPriceAlerts = async () => {
    try {
      const stored = await AsyncStorage.getItem('priceAlerts');
      if (stored) {
        const alerts = JSON.parse(stored);
        setPriceAlerts(alerts.slice(0, size === 'small' ? 1 : size === 'medium' ? 2 : 3));
      }
    } catch (error) {
      console.error('Error loading price alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openApp = () => {
    // Deep link to open the main app
    // This would use Linking.openURL or similar
    console.log('Opening StyleLink app...');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles[size]]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (priceAlerts.length === 0) {
    return (
      <View style={[styles.container, styles[size]]}>
        <Text style={styles.titleText}>StyleLink</Text>
        <Text style={styles.emptyText}>No price alerts yet</Text>
        <TouchableOpacity style={styles.button} onPress={openApp}>
          <Text style={styles.buttonText}>Open App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={styles.titleText}>Price Drops</Text>
      {priceAlerts.map((shoe) => (
        <TouchableOpacity 
          key={shoe.id} 
          style={styles.shoeItem} 
          onPress={() => openApp()}
        >
          <View style={styles.shoeInfo}>
            <Text style={styles.shoeName} numberOfLines={1}>
              {shoe.name}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>
                ${shoe.currentPrice}
              </Text>
              <Text style={styles.originalPrice}>
                ${shoe.originalPrice}
              </Text>
              <Text style={styles.savings}>
                Save ${shoe.originalPrice - shoe.currentPrice}
              </Text>
            </View>
            <Text style={styles.retailer}>{shoe.retailer}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  small: {
    width: 150,
    height: 150,
  },
  medium: {
    width: 320,
    height: 150,
  },
  large: {
    width: 320,
    height: 300,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  shoeItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  shoeInfo: {
    flex: 1,
  },
  shoeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  savings: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  retailer: {
    fontSize: 10,
    color: '#666',
  },
});
