import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function WelcomeScreen() {
  const { user } = useAuthStore();

  useEffect(() => {
    // Show this screen for 1.5 seconds then transition to tabs
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back,</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#000" size="small" />
        <Text style={styles.loadingText}>Preparing your dashboard...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#737373',
    marginBottom: 8,
  },
  email: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 40,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#737373',
  },
});
