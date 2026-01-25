import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Test NativeWind
      </Text>
      <Text style={styles.subtitle}>
        Estilos con StyleSheet funcionan
      </Text>
      <View className="bg-red-500 p-4 rounded-lg mt-4">
        <Text className="text-white text-xl">
          Este texto usa className (NativeWind)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6', // blue-500
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#FDE047', // yellow-300
    fontSize: 24,
    marginTop: 16,
  },
});
