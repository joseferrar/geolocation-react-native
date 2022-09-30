import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import database from '@react-native-firebase/database';
import { async } from '@firebase/util';

const App = () => {
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

  const [info, setInfo] = React.useState(0);

  // Geolocation.getCurrentPosition(data => {
  //   setInfo(data.coords.latitude);
  //   console.log(data);
  // });

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
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
            //To Check, If Permission is granted
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
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
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
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);

        update_current_loc();
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



  const update_current_loc = async () => {
    var user_id = "24"
    database()
      .ref(`/users_current_location/user_id: ${user_id}`)
      .set({
        user_name: "Jose",
        coor: {
          lat: currentLatitude,
          lng: currentLongitude,
        }
      })
      .then(() => console.log('Data set.'))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text>My App</Text>
      {/* <Text>My Location - {info}</Text> */}
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initial_Region}>
        <Marker coordinate={initial_Region} title="start" />
        {/*  <Marker coordinate={droplocationCords} title="destination" /> */}

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
        {/* <Marker
          coordinate={{ latitude: 37.7825259, longitude: -122.4351431 }}
          title="Latitude"></Marker> */}
      </MapView>
      <Button title="Longitude" onPress={update_current_loc} />
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
