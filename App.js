import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import database from '@react-native-firebase/database';
import { async } from '@firebase/util';
import GetLocation from 'react-native-get-location'
import Toast from 'react-native-simple-toast';
const App = () => {
  const user_id = "24"
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
  }
  const mapRef = useRef();
  const { pickupCords, droplocationCords } = state;
  const [current_Longitude, setCurrentLongitude] = useState('...');
  const [current_Latitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');


  useEffect(() => {
    const interval = setInterval(() => {
      requestLocationPermission();
      console.log("Interval called")
    }, 6000);
    return () => clearInterval(interval)
  }, [])

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
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

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

  useEffect(() => {

    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        update_current_loc(currentLatitude, currentLongitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      async (position) => {
        setLocationStatus('You are Here');
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
        update_current_loc(currentLatitude, currentLongitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };



  const update_current_loc = async (c_lat, c_lng) => {
    database()
      .ref(`/users_current_location/user_id: ${user_id}`)
      .set({
        user_name: "Jose",
        coor: {
          lat: c_lat,
          lng: c_lng,
        }
      })
      .then(() => {

        Toast.show('Location Update 👋');
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-start" }}>
        <Text>Location Status: {locationStatus}</Text>
        <Text>current Location: {current_Latitude}, {current_Longitude}</Text>

      </View>

      {/* <MapView
          ref={mapRef}
          showsUserLocation={true}
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
        </MapView> */}

      <View style={{ marginTop: 20 }}>
        <Button
          title="check current loc"
          onPress={getOneTimeLocation}
        />
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
