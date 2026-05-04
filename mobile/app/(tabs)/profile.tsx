import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

export default function ProfileScreen() {
  const { user, role, clearSession } = useAuthStore();
  const isAdmin = role === 'admin';

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    const performLogout = async () => {
      try {
        if (supabase) {
          await supabase.auth.signOut();
        }
        clearSession();
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Logout error:', error);
        clearSession();
        router.replace('/(auth)/login');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) {
        performLogout();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: performLogout }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Manage your profile and settings</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{user?.email || 'No email'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Account Role</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role?.toUpperCase() || 'USER'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Recent Orders</Text>
          {loadingOrders ? (
            <ActivityIndicator color="#000" />
          ) : orders.length === 0 ? (
            <Text style={styles.emptyText}>No orders yet.</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderItem}>
                <View>
                  <Text style={styles.orderIdText}>Order #{order.id.slice(0, 8)}</Text>
                  <Text style={styles.orderDateText}>{new Date(order.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.status === 'delivered' ? '#000' : '#f5f5f5' }]}>
                  <Text style={[styles.statusText, { color: order.status === 'delivered' ? '#fff' : '#000' }]}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administration</Text>
            <Button 
              title="Open Admin Panel" 
              variant="secondary" 
              onPress={() => router.push('/admin')} 
              style={styles.adminButton}
            />
          </View>
        )}

        <View style={styles.spacer} />

        <Button 
          title="Sign Out" 
          variant="outline" 
          onPress={handleLogout} 
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#737373',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  adminButton: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  orderDateText: {
    fontSize: 12,
    color: '#737373',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyText: {
    color: '#a3a3a3',
    fontSize: 14,
    fontStyle: 'italic',
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
  spacer: {
    flex: 1,
  },
});
