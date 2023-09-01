import React, { useState } from 'react';
import { Layout, Text, Card, Input, Button, Select, SelectItem, Modal } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from '@ui-kitten/components';
import { IndexPath } from '@ui-kitten/components';

const statusOptions = [
  { text: 'Ganada', value: 'Ganada' },
  { text: 'Perdida', value: 'Perdida' },
  { text: 'Pendiente', value: 'Pendiente' },
  { text: 'Push', value: 'Push' },
];

const AddScreen: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [momio, setMomio] = useState<string>('');
  const [monto, setMonto] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>(statusOptions[0].value);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[] | undefined>(new IndexPath(0)); // Valor predeterminado

  const formatDate = (date: Date): string => {
    // Formato personalizado de fecha
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Cambia a formato 12 horas
    };

    return date.toLocaleString('en-US', options);
  };

  const saveBet = async () => {
    if (!title || !momio || !monto || !selectedDate || !status) {
      setErrorMessage('Todos los campos son requeridos');
      return;
    }

    try {
      const formattedDate = selectedDate ? formatDate(selectedDate) : '';
      const bet = { title, momio, monto, fecha: formattedDate, status };
      const storedBets = await AsyncStorage.getItem('bets');
      const parsedBets = storedBets ? JSON.parse(storedBets) : [];
      parsedBets.push(bet);
      console.log('Bet to be saved:', bet);
      await AsyncStorage.setItem('bets', JSON.stringify(parsedBets));
      // Limpiar los campos después de guardar
      setTitle('');
      setMomio('');
      setMonto('');
      setSelectedDate(null);
      setStatus(statusOptions[0].value);
      setErrorMessage('');
      setSelectedIndex(new IndexPath(0)); // Restablecer a la opción predeterminada
    } catch (error) {
      console.error('Error saving bet:', error);
    }
  };

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Text category='h6'>Control de Apuestas</Text>

      <Card style={{ marginVertical: 16 }}>
        <Text category='h6'>Crear Apuesta</Text>
        <Input
          placeholder='Título'
          value={title}
          onChangeText={setTitle}
        />
        <Input
          placeholder='Momio'
          value={momio}
          onChangeText={setMomio}
        />
        <Input
          placeholder='Monto Jugado'
          value={monto}
          onChangeText={setMonto}
        />
        <Button onPress={() => setModalVisible(true)}>Seleccionar Fecha</Button>
        <Select
          placeholder='Status'
          selectedIndex={selectedIndex}
          onSelect={index => {
            setStatus(statusOptions[index.row].value);
            setSelectedIndex(index);
          }}
        >
          {statusOptions.map(option => (
            <SelectItem key={option.value} title={option.text} />
          ))}
        </Select>
        {errorMessage ? <Text style={{ color: 'red', marginBottom: 8 }}>{errorMessage}</Text> : null}
        <Button onPress={saveBet}>Guardar Apuesta</Button>
      </Card>

      <Modal
        visible={modalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setModalVisible(false)}
      >
        <Calendar
          date={selectedDate}
          onSelect={nextDate => {
            setSelectedDate(nextDate);
            setModalVisible(false);
          }}
        />
      </Modal>
    </Layout>
  );
};

export default AddScreen;
