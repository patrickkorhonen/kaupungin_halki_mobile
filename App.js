import { StatusBar } from "expo-status-bar";
import { Text, View, Modal, Button, Image, Animated, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MapView from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Marker, Callout } from "react-native-maps";
import Svg, { Circle } from "react-native-svg";
import { getDistance } from "geolib";
import locations from "./locations.json";
import kampela from "./assets/kampela.jpg";
import tuomiokirkko from "./assets/tuomiokirkko.jpg";
import PopUp from "./components/PopUp";

const images = {
  1: tuomiokirkko,
  2: kampela,
  3: kampela,
};

const places = JSON.parse(JSON.stringify(locations));

export default function App() {
  const [location, setLocation] = useState([60.1756, 24.9342]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuButtonAnimation, setMenuButtonAnimation] = useState(0);

  const toggleMenu = () => {
    menuOpen ? setMenuButtonAnimation(0) : setMenuButtonAnimation(1),
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation([location.coords.latitude, location.coords.longitude]);
      setLoading(false);

      let locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 3000,
          distanceInterval: 2,
        },
        (newLocation) => {
          setLocation([
            newLocation.coords.latitude,
            newLocation.coords.longitude,
          ]);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  if (loading) {
    return <Text>Lataa...</Text>;
  }

  //toimii const distance = getDistance({latitude: location[0], longitude: location[1]}, {latitude: tuomiokirkko[0], longitude: tuomiokirkko[1]});

  return (
    <View className="h-full bg-orange-100">
      {/*}
      <View className="flex justify-between items-center flex-row mt-10">
        <Text className="text-4xl font-bold mx-auto">Kaupungin halki</Text>
        <View className="bg-orange-200 rounded-full flex justify-center items-center p-4 m-4">
          <SimpleLineIcons name="menu" size={30} color="black" />
        </View>
      </View>
  */}
      <MapView
        initialRegion={{
          latitude: location[0],
          longitude: location[1],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsCompass={false}
        mapType=""
        className="h-full"
      >
        <View className="flex justify-between items-center flex-row">
          <Text className="text-4xl text-black font-black mx-auto mt-14">
            Kaupungin halki
          </Text>
          <View className="bg-orange-200 border-2 border-orange-100 rounded-full flex justify-center items-center p-4 mt-14 mr-auto">
              <TouchableOpacity onPress={toggleMenu} style={{ transform: [{ rotate: menuButtonAnimation == 0 ? "0deg" : "90deg" }] }}>
                <SimpleLineIcons name="menu" size={30} color="black" />
              </TouchableOpacity>
          </View>
        </View>
        <Marker coordinate={{ latitude: location[0], longitude: location[1] }}>
          <Svg height="25" width="25" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="45" fill="black" />
            <Circle
              cx="50"
              cy="50"
              r="35"
              stroke="white"
              strokeWidth="10"
              fill="blue"
            />
          </Svg>
        </Marker>
        {places.locations.map((place, index) =>
          Number(
            getDistance(
              { latitude: location[0], longitude: location[1] },
              { latitude: place.lat, longitude: place.lon }
            )
          ) < place.radius ? (
            <Marker
              key={index}
              coordinate={{ latitude: place.lat, longitude: place.lon }}
              onPress={() =>
                setModalVisible([place.name, images[index + 1], place.info])
              }
            >
              <Svg height="25" width="25" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="45" fill="black" />
                <Circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="white"
                  strokeWidth="10"
                  fill="green"
                />
              </Svg>
              {modalVisible != null && (
                <PopUp
                  props={{
                    set: setModalVisible,
                    name: modalVisible[0],
                    image: modalVisible[1],
                    info: modalVisible[2],
                  }}
                />
              )}
            </Marker>
          ) : (
            <Marker
              key={index}
              coordinate={{ latitude: place.lat, longitude: place.lon }}
            >
              <Svg height="25" width="25" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="45" fill="black" />
                <Circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="white"
                  strokeWidth="10"
                  fill="red"
                />
              </Svg>
            </Marker>
          )
        )}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}