import React, { useState, useEffect } from 'react';
import { Layout, Button, List, ListItem, Avatar, Input, Text } from '@ui-kitten/components';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [betList, setBetList] = useState([]);
  const [location, setLocation] = useState(''); // Campo de ubicación
  const [showStatistics, setShowStatistics] = useState(false); // Mostrar estadísticas

  useEffect(() => {
    loadProfileData();
    loadBetList();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage');
      const storedName = await AsyncStorage.getItem('name');
      setProfileImage(storedImage);
      setName(storedName || '');
      setLocation(await AsyncStorage.getItem('location') || ''); // Cargar ubicación
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const loadBetList = async () => {
    try {
      const storedBetList = await AsyncStorage.getItem('betList');
      if (storedBetList) {
        setBetList(JSON.parse(storedBetList));
      }
    } catch (error) {
      console.error('Error loading bet list:', error);
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('profileImage', profileImage);
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('location', location); // Guardar ubicación
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const selectProfileImage = () => {
    ImagePicker.launchImageLibrary({ title: 'Seleccionar Imagen de Perfil' }, (response) => {
      if (!response.didCancel && !response.error) {
        setProfileImage(response.uri);
        saveProfileData();
      }
    });
  };
  

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Avatar source={{ uri: profileImage }} size='giant' style={{ alignSelf: 'center', marginBottom: 16 }} onPress={selectProfileImage} />
      <Button onPress={selectProfileImage}>Cambiar Imagen de Perfil</Button>

      <Input
        placeholder='Nombre'
        value={name}
        onChangeText={setName}
        onBlur={saveProfileData}
      />

      <Input
        placeholder='Ubicación'
        value={location}
        onChangeText={setLocation}
        onBlur={saveProfileData}
      />

      <Button onPress={() => setShowStatistics(!showStatistics)}>Mostrar Estadísticas</Button>

      {showStatistics && (
        <Layout>
          <Text category='h6'>Estadísticas de Apuestas</Text>
          <Text>Total de Apuestas: {betList.length}</Text>
          <Text>Apuestas Ganadas: {betList.filter(bet => bet.status === 'Ganada').length}</Text>
          <Text>Apuestas Perdidas: {betList.filter(bet => bet.status === 'Perdida').length}</Text>
        </Layout>
      )}

      <List
        style={{ marginTop: 16 }}
        data={betList}
        renderItem={({ item }) => (
          <ListItem title={item.title} description={`Status: ${item.status}`} />
        )}
      />
    </Layout>
  );
};

export default ProfileScreen;
