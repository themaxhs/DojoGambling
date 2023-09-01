import React, { useState, useEffect } from 'react';
import { Layout, Text, Card, Icon, Button, Spinner } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl, ScrollView, View, StyleSheet } from 'react-native';

const HomeScreen: React.FC = () => {
  const [ganados, setGanados] = useState<any[]>([]);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [perdidos, setPerdidos] = useState<any[]>([]);
  const [push, setPush] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBets();
    setRefreshing(false);
  };

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    try {
      const storedBets = await AsyncStorage.getItem('bets');
      if (storedBets) {
        const parsedBets = JSON.parse(storedBets);
        const ganadosBets = parsedBets.filter((bet: any) => bet.status === 'Ganada');
        const pendientesBets = parsedBets.filter((bet: any) => bet.status === 'Pendiente');
        const perdidosBets = parsedBets.filter((bet: any) => bet.status === 'Perdida');
        const pushBets = parsedBets.filter((bet: any) => bet.status === 'Push');
        setGanados(ganadosBets);
        setPendientes(pendientesBets);
        setPerdidos(perdidosBets);
        setPush(pushBets);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading bets:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ganada':
        return '#4CAF50'; // Verde
      case 'Perdida':
        return '#F44336'; // Rojo
      case 'Pendiente':
        return '#FFFFFF'; // Blanco
      case 'Push':
        return '#FFC107'; // Amarillo
      default:
        return '#FFFFFF';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ganada':
        return 'checkmark-circle-outline';
      case 'Perdida':
        return 'close-circle-outline';
      case 'Pendiente':
        return 'clock-outline';
      case 'Push':
        return 'flash-outline';
      default:
        return 'clock-outline';
    }
  };

  const renderBetCard = (bet: any) => (
    <Card
      key={bet.title}
      style={styles.card}
    >
      <Layout style={styles.cardHeader}>
        <Icon
          name={getStatusIcon(bet.status)}
          fill={getStatusColor(bet.status)}
          style={styles.icon}
        />
        <Text category='s1' style={styles.title}>{bet.title}</Text>
      </Layout>
      <Text>Momio: {bet.momio}</Text>
      <Text>Monto Jugado: {bet.monto}</Text>
      <Text>Fecha: {bet.fecha}</Text>
    </Card>
  );

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size='giant' />
        <Text category='s1'>Cargando apuestas...</Text>
      </Layout>
    );
  }

  // Calcular estadísticas
  const totalGanados = ganados.length;
  const totalPerdidos = perdidos.length;
  const totalPendientes = pendientes.length;
  const totalPush = push.length;
  const totalApuestas = totalGanados + totalPerdidos + totalPendientes + totalPush;

  // Calcular balance
  const totalGanancias = ganados.reduce((total, bet) => total + parseFloat(bet.monto), 0);
  const totalPerdidas = perdidos.reduce((total, bet) => total + parseFloat(bet.monto), 0);
  const balance = totalGanancias - totalPerdidas;

  return (
    <Layout style={styles.container}>
      <Text category='h5'>Control de Apuestas</Text>

      <ScrollView
        horizontal // Esto permite que la vista se desplace horizontalmente
        style={styles.statsScrollView}
      >
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text category='h6'>Ganadas</Text>
            <Text category='s1'>{totalGanados}</Text>
          </View>
          <View style={styles.stat}>
            <Text category='h6'>Perdidas</Text>
            <Text category='s1'>{totalPerdidos}</Text>
          </View>
          <View style={styles.stat}>
            <Text category='h6'>Pendientes</Text>
            <Text category='s1'>{totalPendientes}</Text>
          </View>
          <View style={styles.stat}>
            <Text category='h6'>Push</Text>
            <Text category='s1'>{totalPush}</Text>
          </View>
          <View style={styles.stat}>
            <Text category='h6'>Total Apuestas</Text>
            <Text category='s1'>{totalApuestas}</Text>
          </View>
          <View style={styles.stat}>
            <Text category='h6'>Balance</Text>
            <Text category='s1'>{balance}</Text>
          </View>
        </View>
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View>
          <Text category='h6'>Ganados</Text>
          {ganados.map(renderBetCard)}
        </View>

        <View>
          <Text category='h6'>Pendientes</Text>
          {pendientes.map(renderBetCard)}
        </View>

        <View>
          <Text category='h6'>Perdidos</Text>
          {perdidos.map(renderBetCard)}
        </View>

        <View>
          <Text category='h6'>Push</Text>
          {push.map(renderBetCard)}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },
  statsScrollView: {
    marginHorizontal: -8, // Para compensar el margen horizontal de los stats individuales
  },
});

export default HomeScreen;
