import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';


const App = () => {
    const [info, setInfo] = React.useState(0);
    Geolocation.getCurrentPosition(data => {
        setInfo(data.coords.latitude);
        console.log(data);
    });
    return (
        <View style={styles.container}>
            <Text>My App</Text>
            <Text>My Location - {info}</Text>
            {/* <MapView
                 showsUserLocation={true}
                 provider={PROVIDER_DEFAULT}
                style={{width: '100%', height: '100%'}}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
              <Marker
          coordinate={{latitude: 37.7825259, longitude: -122.4351431}}
          title="Latitude"></Marker>
      </MapView> */}
       
        </View>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
