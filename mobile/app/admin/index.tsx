import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../services/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function AdminScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!name || !price || !image) {
      Alert.alert('Error', 'Please fill in name, price, and image URL');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name,
          description,
          price: parseFloat(price),
          image,
          category,
        });

      if (error) throw error;

      Alert.alert('Success', 'Product added successfully!');
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategory('');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Manage your products and orders</Text>
        </View>

        <View style={styles.adminActions}>
          <Button 
            title="Manage All Orders" 
            onPress={() => router.push('/admin/orders')}
            style={{ marginBottom: 24 }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Add New Product</Text>
        </View>

        <View style={styles.form}>
          <Input 
            label="Product Name" 
            placeholder="e.g. Wireless Headphones" 
            value={name} 
            onChangeText={setName} 
          />
          <Input 
            label="Description" 
            placeholder="Tell us about the product" 
            value={description} 
            onChangeText={setDescription} 
            multiline 
            numberOfLines={3}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
          <Input 
            label="Price ($)" 
            placeholder="0.00" 
            value={price} 
            onChangeText={setPrice} 
            keyboardType="numeric" 
          />
          <Input 
            label="Image URL" 
            placeholder="https://images.unsplash.com/..." 
            value={image} 
            onChangeText={setImage} 
          />
          
          {image ? (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Image Preview</Text>
              <Image source={{ uri: image }} style={styles.previewImage} />
            </View>
          ) : null}

          <Input 
            label="Category" 
            placeholder="e.g. Electronics, Fashion" 
            value={category} 
            onChangeText={setCategory} 
          />

          <Button 
            title="Create Product" 
            onPress={handleAddProduct} 
            loading={loading} 
            style={styles.button}
          />
          <Button 
            title="Cancel" 
            variant="outline" 
            onPress={() => router.back()} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#737373',
  },
  form: {
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  previewContainer: {
    marginBottom: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  previewLabel: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  button: {
    marginTop: 16,
    marginBottom: 12,
  },
});
