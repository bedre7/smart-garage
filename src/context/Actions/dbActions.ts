import Device from '../../models/Device/Device';
import { db } from '../../store/firebase';
import History from '../../models/History';

export const getDb = () => {
  return db;
};

export const getDevices = async () => {
  return db.collection('devices').get();
};

export const getDeviceByName = async (name: string) => {
  return db.collection('devices').where(name, '==', 'name').get();
};

export const updateDeviceOnDb = async (device: Device) => {
  return db
    .collection('devices')
    .doc(device.id)
    .update({ ...device, lastActionTime: device.lastActionTime.toString() });
};

export const addHistory = async (newHistory: History) => {
  return db.collection('history').add(newHistory);
};

// export const updateDevice = async (name: string, value: any) => {
//   const updatedDevice = await db
//     .collection('devices')
//     .where(name, '==', name)
//     .update(value);
//   return updatedDevice;
// };