import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import database from '@react-native-firebase/database';

const App = () => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyA5R-ajr7JfuwD4KY_c7Yu3dYHTX3K6ZMg';
  const [name, setName] = useState();
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
  const mapRef = useRef();
  const {pickupCords, droplocationCords} = state;

  const [info, setInfo] = React.useState(0);
  Geolocation.getCurrentPosition(data => {
    setInfo(data.coords.latitude);
    console.log(data);
  });

  const handleClick = async () => {
    database()
      .ref('/users/123')
      .set({
        name: 'Ada Lovelace',
        age: 31,
      })
      .then(() => console.log('Data set.'))
      .catch(err => console.log(err));
  };
  console.log(name);
  return (
    <View style={styles.container}>
      <Text>My App</Text>
      <Text>My Location - {info}</Text>
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={pickupCords}>
        <Marker coordinate={pickupCords} title="start" />
        <Marker coordinate={droplocationCords} title="destination" />

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
          coordinate={{latitude: 37.7825259, longitude: -122.4351431}}
          title="Latitude"></Marker> */}
      </MapView>
      <Button title="Longitude" onPress={handleClick} />
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
