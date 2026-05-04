import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/authStore';
import { useStore } from '../src/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function CheckoutScreen() {
  const { user } = useAuthStore();
  const { cart, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  
  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validateForm = () => {
    if (cardNumber.length < 16) return 'Invalid card number';
    if (!expiry.includes('/')) return 'Invalid expiry date (MM/YY)';
    if (cvv.length < 3) return 'Invalid CVV';
    if (!cardName) return 'Cardholder name is required';
    return null;
  };

  const handlePayment = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      Alert.alert('Validation Error', errorMsg);
      return;
    }

    setLoading(true);

    // Simulate Payment Gateway Delay
    setTimeout(async () => {
      try {
        if (!user) throw new Error('User not authenticated');

        // 1. Create Order in Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            items: cart,
            total_price: totalAmount,
            status: 'open',
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Success Feedback
        setLoading(false);
        clearCart();
        
        Alert.alert(
          'Payment Successful',
          'Your order has been placed successfully. Order ID: ' + order.id.slice(0, 8),
          [{ text: 'View My Orders', onPress: () => router.replace('/(tabs)/profile') }]
        );
      } catch (error: any) {
        setLoading(false);
        Alert.alert('Payment Failed', error.message);
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Complete your purchase</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.totalText}>${totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.cardForm}>
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardName}
              onChangeText={setCardName}
            />
            <Input
              label="Card Number"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').slice(0, 16))}
              keyboardType="numeric"
            />
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="CVV"
                  placeholder="123"
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>

        <Button
          title={loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)} Now`}
          onPress={handlePayment}
          loading={loading}
          style={styles.payButton}
        />
        
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#737373',
    marginTop: 4,
  },
  summaryBox: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#a3a3a3',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  cardSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  cardForm: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  payButton: {
    marginBottom: 12,
    height: 56,
  },
});
