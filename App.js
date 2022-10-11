import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import database from '@react-native-firebase/database';
import {async} from '@firebase/util';
import GetLocation from 'react-native-get-location';
import Toast from 'react-native-simple-toast';
import BackgroundService from 'react-native-background-actions';

//request the permission before starting the service.
const backgroundgranted = PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  {
    title: 'Background Location Permission',
    message:
      'We need access to your location ' +
      'so you can get live quality updates.',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  },
);

const App = () => {
  const [restrict, setRestrict] = useState(true);
  const [stop, setStop] = useState(true);
  const [timer, setTimer] = useState(0);

  const user_id = '24';
  const GOOGLE_MAPS_APIKEY = 'AIzaSyA5R-ajr7JfuwD4KY_c7Yu3dYHTX3K6ZMg';
  const [state, setState] = React.useState({
    pickupCords: {
      latitude: 30.7246,
      longitude: 76.8179,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    droplocationCords: {
      latitude: 30.7333,
      longitude: 76.7794,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });

  var initial_Region = {
    latitude: 30.7246,
    longitude: 76.8179,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const mapRef = useRef();
  const interval = useRef(null);
  const {pickupCords, droplocationCords} = state;
  const [current_Longitude, setCurrentLongitude] = useState('...');
  const [current_Latitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    interval.current = setInterval(() => {
      requestLocationPermission();
      setTimer(timer => timer + 1);
      console.log('Interval called');
    }, 0);
    return () => clearInterval();
  }, []);
  const handleReset = () => {
    setStop(true);
    interval.current = setInterval(() => {
      requestLocationPermission();
      setTimer(timer => timer + 1);
      console.log('Interval called');
    }, 0);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (
          granted === PermissionsAndroid.RESULTS.GRANTED ||
          backgroundgranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          getOneTimeLocation();
          subscribeLocationLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // useEffect(() => {
  //   requestLocationPermission();
  //   return () => {
  //     Geolocation.clearWatch(watchID);
  //   };
  // }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      async position => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        //main villan
        update_current_loc(currentLatitude, currentLongitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      async position => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        update_current_loc(currentLatitude, currentLongitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  const update_current_loc = async (c_lat, c_lng) => {
    database()
      .ref(`/users_current_location/user_id: ${user_id}`)
      .set({
        user_name: 'Jose',
        coor: {
          lat: c_lat,
          lng: c_lng,
        },
      })
      .then(() => {
        // Toast.show('Location Update 👋');
      })
      .catch(err => console.log(err));
  };
  const backRunStart = async () => {
    setRestrict(true);
  };
  const backRunStop = async () => {
    setRestrict(false);
  };

  if (restrict === true) {
    const veryIntensiveTask = async taskDataArguments => {
      // Example of an infinite loop task
      const sleep = time =>
        new Promise(resolve => setTimeout(() => resolve(), time));
      const {delay} = taskDataArguments;
      await new Promise(async resolve => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          // console.log('background running');

          await sleep(delay);
        }
      });
    };
    const options = {
      taskName: 'Example',
      taskTitle: 'Geo Location App',
      taskDesc: 'Live tracking',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane', // Add this
      parameters: {
        delay: 10000,
      },
    };

    BackgroundService.start(veryIntensiveTask, options);
    // BackgroundService.stop();
  } else {
    BackgroundService.stop();
    // console.log('backgroud stop');
  }

  return (
    <View style={styles.container}>
      {/* <View style={{alignItems: 'flex-start'}}>
        <Text>Location Status: {locationStatus}</Text>
        <Text>
          current Location: {current_Latitude}, {current_Longitude}
        </Text>
      </View> */}

      <MapView
        ref={mapRef}
        showsUserLocation={stop}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initial_Region}>
        <Marker coordinate={initial_Region} title="start" />

        <MapViewDirections
          origin={pickupCords}
          destination={droplocationCords}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
          optimizeWaypoints={true}
          onReady={result => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: 30,
                bottom: 300,
                left: 30,
                top: 100,
              },
            });
          }}
        />
      </MapView>

      <View style={{marginTop: 20}}>
        <Button title="check current loc" onPress={getOneTimeLocation} />
        {/* {restrict === true ? (
          <Button title="Start" color="green" onPress={handleReset} />
        ) : (
          <Button title="Stop" color="red"    onPress={async () => {
            await setStop(false);
            const obj = {
              lat: current_Latitude,
              long: current_Longitude,
            };
            let arr = [];
            arr.push(obj);
            console.log('latloong', arr);
            await update_current_loc(obj.lat, obj.long);
            await clearInterval(interval.current);
          }} />
        )} */}
        <Button
          title={stop ? 'Stop' : 'start'}
          color={stop ? 'red' : 'green'}
          onPress={async () => {
            if (stop) {
              await setStop(false);
              const obj = {
                lat: current_Latitude,
                long: current_Longitude,
              };
              // let arr = [];
              // arr.push(obj);
              // console.log('latloong', arr);
              await update_current_loc(obj.lat, obj.long);
              await clearInterval(interval.current);
            } else {
              await handleReset();
            }
          }}
        />
        {/* <Button title="loc start" onPress={handleReset} /> */}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
