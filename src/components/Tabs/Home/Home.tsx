import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DeviceCard from './DeviceCard';
import DevicesContextProvider from '../../../context/device-context';

type DeviceDetailsProps = {
  deviceName: string;
};

export type HomeStackParamList = {
  DevicesOverview: undefined;
  DeviceDetails: DeviceDetailsProps;
};

const Stack = createStackNavigator<HomeStackParamList>();

const Home = () => {
  return (
    <DevicesContextProvider>
      <View style={styles.container}>
        <DeviceCard name="Garage Door" />
        <DeviceCard name="Delivery Box" />
      </View>
    </DevicesContextProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
