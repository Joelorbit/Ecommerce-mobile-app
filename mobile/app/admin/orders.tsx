import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../services/supabase';
import { Button } from '../../components/ui/Button';

type OrderStatus = 'open' | 'ongoing' | 'delivered';

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      Alert.alert('Update Failed', error.message);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusColor = item.status === 'delivered' ? '#10b981' : item.status === 'ongoing' ? '#f59e0b' : '#3b82f6';
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.orderDetails}>
          <Text style={styles.detailLabel}>Customer ID:</Text>
          <Text style={styles.detailValue}>{item.user_id.slice(0, 12)}...</Text>
          
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.priceValue}>${item.total_price.toFixed(2)}</Text>
          
          <Text style={styles.detailLabel}>Items:</Text>
          <Text style={styles.itemsList}>
            {item.items.map((i: any) => `${i.quantity}x ${i.product.name}`).join(', ')}
          </Text>
        </View>

        <View style={styles.actions}>
          {item.status === 'open' && (
            <Button 
              title="Mark Ongoing" 
              onPress={() => updateStatus(item.id, 'ongoing')}
              style={styles.actionBtn}
            />
          )}
          {item.status === 'ongoing' && (
            <Button 
              title="Mark Delivered" 
              onPress={() => updateStatus(item.id, 'delivered')}
              style={styles.actionBtn}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back to Admin</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Orders</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#000" size="large" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  backLink: {
    color: '#737373',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  list: {
    padding: 24,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    padding: 20,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  orderDetails: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: '#a3a3a3',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  itemsList: {
    fontSize: 14,
    color: '#404040',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    height: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#737373',
  }
});
