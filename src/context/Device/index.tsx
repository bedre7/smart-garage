import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  FC,
} from 'react';
import Device from '../../models/Device/Device';
import { Actions } from '.././Actions/DeviceActions';
import { close, open } from '../../store/Devices';
import { GarageDoor, DeliveryBox } from './Devices';
import DeviceName from '../../models/Device/DeviceName';
import { addHistory, getDevices, updateDeviceOnDb } from '../Actions/dbActions';
import { useAuth } from '../auth-context';
import History from '../../models/History';

interface IDevicesContext {
  garageDoor: Device;
  deliveryBox: Device;
  updateDevice: (device: Device, action: Actions) => void;
  isLoading: boolean;
}

const DevicesContext = createContext<IDevicesContext>({
  garageDoor: GarageDoor,
  deliveryBox: DeliveryBox,
  updateDevice: (device: Device | null, action: Actions) => {},
  isLoading: true,
});

export const useDevices = () => React.useContext(DevicesContext);

const DevicesContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [garageDoor, setGarageDoor] = useState<Device>(GarageDoor);
  const [deliveryBox, setDeliveryBox] = useState<Device>(DeliveryBox);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const fetchDevices = async () => {
      // fetch devices from server
      getDevices()
        .then((snapshot) => {
          const device: any = [];
          snapshot.forEach((doc: any) => {
            const tempDevice = doc.data();
            tempDevice.id = doc.id;
            tempDevice.lastActionTime = new Date(tempDevice.lastActionTime);

            device.push(new Device(tempDevice));
          });
          setGarageDoor(
            device.find((d: any) => d.name === DeviceName.GARAGE_DOOR)
          );
          setDeliveryBox(
            device.find((d: any) => d.name === DeviceName.DELIVERY_BOX)
          );
        })
        .catch((error) => {
          console.log(error);
        });

      setIsLoading(false);
    };
    fetchDevices();
  }, [getDevices]);

  useEffect(() => {
    updateDeviceOnDb(garageDoor);
    const newHistory = new History({
      id: '',
      device: garageDoor.name,
      isOpen: garageDoor.isOpen,
      user: currentUser!.username,
      createdAt: new Date(),
    });
    
    addHistory(newHistory);
  }, [garageDoor, updateDeviceOnDb]);

  useEffect(() => {
    updateDeviceOnDb(deliveryBox);
  }, [deliveryBox, updateDeviceOnDb]);

  const updateDevice = async (device: Device, action: Actions) => {
    // update device on server
    if (!device) return;

    switch (action) {
      case Actions.OPEN:
        setIsLoading(true);
        await open(device.name);
        if (device.name == DeviceName.GARAGE_DOOR) {
          setGarageDoor({
            ...device,
            isOpen: true,
            lastActionTime: new Date(),
          });
        } else {
          setDeliveryBox({
            ...device,
            isOpen: true,
            lastActionTime: new Date(),
          });
        }
        setIsLoading(false);
        break;
      case Actions.CLOSE:
        setIsLoading(true);
        await close(device.name);
        if (device.name == DeviceName.GARAGE_DOOR) {
          setGarageDoor({
            ...device,
            isOpen: false,
            lastActionTime: new Date(),
          });
        } else {
          setDeliveryBox({
            ...device,
            isOpen: false,
            lastActionTime: new Date(),
          });
        }
        setIsLoading(false);
        break;
      case Actions.TOGGLE:
        setIsLoading(true);
        if (device.isOpen) {
          await close(device.name);
          if (device.name == DeviceName.GARAGE_DOOR) {
            setGarageDoor({
              ...device,
              isOpen: false,
              lastActionTime: new Date(),
            });
          } else {
            setDeliveryBox({
              ...device,
              isOpen: false,
              lastActionTime: new Date(),
            });
          }
        } else {
          await open(device.name);
          if (device.name == DeviceName.GARAGE_DOOR) {
            setGarageDoor({
              ...device,
              isOpen: true,
              lastActionTime: new Date(),
            });
          } else {
            setDeliveryBox({
              ...device,
              isOpen: true,
              lastActionTime: new Date(),
            });
          }
        }
        setIsLoading(false);
        break;
      case Actions.UPDATE_SETTINGS:
        setIsLoading(true);
        if (device.isOpen) {
          await open(device.name);
        } else {
          await close(device.name);
        }
        if (device.name == DeviceName.GARAGE_DOOR) {
          setGarageDoor({
            ...device,
            lastActionTime: new Date(),
          });
        } else {
          setDeliveryBox({
            ...device,
            lastActionTime: new Date(),
          });
        }
        setIsLoading(false);
        break;
      default:
        break;
    }
  };
  return (
    <DevicesContext.Provider
      value={{
        garageDoor,
        deliveryBox,
        isLoading,
        updateDevice,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
};

export default DevicesContextProvider;