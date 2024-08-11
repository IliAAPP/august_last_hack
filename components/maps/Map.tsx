import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    FlatList,
    Keyboard,
    Platform
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { markers } from "./markers";
import haversine from "haversine-distance";
import { FontAwesome5 } from "@expo/vector-icons";

type MarkerType = {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
    name: string;
    job: string;
    salary: string;
};

const INITIAL_REGION = {
    latitude: 45.0355,
    longitude: 38.975,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

export default function Map() {
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const [searchText, setSearchText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [filters, setFilters] = useState(null);
    const [filteredMarkers, setFilteredMarkers] = useState(markers);

    useEffect(() => {
        if (route.params?.filters) {
            setFilters(route.params.filters);
        }
    }, [route.params?.filters]);

    useEffect(() => {
        const filterMarkers = () => {
            if (!filters) {
                setFilteredMarkers(markers);
                return;
            }
            const result = markers.filter((marker) => {
                // Приведение всех строк в нижний регистр для корректного сравнения
                const keywordMatch = filters.keywords
                    ? marker.name.toLowerCase().includes(filters.keywords.toLowerCase())
                    : true;
                const salary = parseFloat(marker.salary.replace(/[^0-9.]/g, ''));
                const salaryMatch = (
                    (filters.salaryFrom ? salary >= filters.salaryFrom : true) &&
                    (filters.salaryTo ? salary <= filters.salaryTo : true)
                );
                const locationMatch = filters.location
                    ? marker.name.toLowerCase().includes(filters.location.toLowerCase())
                    : true;
                const hoursMatch = (
                    (filters.hoursFrom ? parseInt(marker.job) >= filters.hoursFrom : true) &&
                    (filters.hoursTo ? parseInt(marker.job) <= filters.hoursTo : true)
                );
                const dayMatch = filters.selectedDay ? marker.job.includes(filters.selectedDay) : true;

                return keywordMatch && salaryMatch && locationMatch && hoursMatch && dayMatch;
            });
            setFilteredMarkers(result);
        };
        filterMarkers();
    }, [filters]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Разрешение не предоставлено");
                return;
            }
            setHasLocationPermission(true);
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    const zoomIn = () => {
        const currentRegion = mapRef.current?.getCamera();
        currentRegion.then((camera) => {
            camera.zoom += 1;
            mapRef.current?.animateCamera(camera, { duration: 500 });
        });
    };

    const zoomOut = () => {
        const currentRegion = mapRef.current?.getCamera();
        currentRegion.then((camera) => {
            camera.zoom -= 1;
            mapRef.current?.animateCamera(camera, { duration: 500 });
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={focusMap}>
                    <View style={{ padding: 10 }}>
                        <Text>Focus</Text>
                    </View>
                </TouchableOpacity>
            ),
        });
    }, []);

    const focusMap = () => {
        const KrasnodarCenter: MarkerType = {
            latitude: 45.04484,
            longitude: 38.97603,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
            name: "Krasnodar",
            job: "",
            salary: "",
        };
        mapRef.current?.animateToRegion({
            latitude: KrasnodarCenter.latitude,
            longitude: KrasnodarCenter.longitude,
            latitudeDelta: KrasnodarCenter.latitudeDelta,
            longitudeDelta: KrasnodarCenter.longitudeDelta,
        });
    };

    const onMarkerSelected = (marker: MarkerType) => {
        Alert.alert(marker.name);
    };

    const showUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Нет разрешения на использование геолокации");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        mapRef.current?.animateToRegion(
            {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            1000
        );
    };

    const calculateDistance = (marker: MarkerType) => {
        if (!userLocation) return null;
        const userCoords = {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
        };
        const markerCoords = {
            latitude: marker.latitude,
            longitude: marker.longitude,
        };
        const distance = haversine(userCoords, markerCoords) / 1000; // Convert to kilometers
        return distance;
    };

    const getDistanceText = (distance) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} м`;
        }
        return `${distance.toFixed(1)} км`;
    };

    const renderSuggestionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => {
                setSearchText(item.name);
                setShowSuggestions(false);
                Keyboard.dismiss();
                mapRef.current?.animateToRegion(
                    {
                        latitude: item.latitude,
                        longitude: item.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    },
                    1000
                );
            }}
        >
            <Text style={styles.suggestionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Поиск по адресу..."
                    placeholderTextColor="white"
                    onChangeText={(text) => {
                        setSearchText(text);
                        setShowSuggestions(true);
                    }}
                    value={searchText}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('FiltersScreen')}
                    style={styles.filterButton}
                >
                    <Text style={styles.filterButtonText}>Фильтры</Text>
                </TouchableOpacity>
            </View>
            {showSuggestions && (
                <FlatList
                    data={filteredMarkers}
                    renderItem={renderSuggestionItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.suggestionsList}
                />
            )}
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={INITIAL_REGION}
                showsUserLocation={hasLocationPermission}
                showsMyLocationButton={false}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                ref={mapRef}
                onPress={() => {
                    setShowSuggestions(false);
                    setSearchText("");
                    Keyboard.dismiss();
                }}
            >
                {filteredMarkers.map((marker, index) => {
                    const distance = calculateDistance(marker);
                    const distanceText = getDistanceText(distance);
                    return (
                        <Marker
                            key={index}
                            title={marker.name}
                            coordinate={marker}
                            onPress={() => onMarkerSelected(marker)}
                        >
                            <View style={styles.markerContainer}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.distanceText}>{distanceText}</Text>
                                    <Text style={styles.jobText}>{marker.job}</Text>
                                    <Text style={styles.salaryText}>{marker.salary}</Text>
                                </View>
                            </View>
                        </Marker>
                    );
                })}
            </MapView>
            <View style={styles.rightCenterButtons}>
                <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>—</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={showUserLocation}
                    style={styles.locationButton}
                >
                    <FontAwesome5
                        name="location-arrow"
                        size={22}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        marginTop: 55,
        padding: 15,
        backgroundColor: "#59A9CC",
        borderRadius: 10,
        zIndex: 1,
    },
    searchBar: {
        flex: 1,
        fontSize: 18,
        color: "white",
    },
    filterButton: {
        marginLeft: 10,
    },
    filterButtonText: {
        color: "white",
        fontSize: 18,
    },
    suggestionsList: {
        backgroundColor: "#fff",
        position: "absolute",
        top: 70,
        left: 10,
        right: 10,
        zIndex: 2,
    },
    suggestionItem: {
        padding: 15,
    },
    suggestionText: {
        fontSize: 18,
    },
    markerContainer: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 5,
        padding: 5,
    },
    infoBox: {
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    distanceText: {
        fontSize: 12,
        color: '#000',
    },
    jobText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    salaryText: {
        fontSize: 12,
        color: '#000',
    },
    rightCenterButtons: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        alignItems: 'center',
    },
    zoomButton: {
        backgroundColor: '#59A9CC',
        borderRadius: 50,
        margin: 10,
        padding: 10,
    },
    zoomText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',    
    },
    locationButton: {
        backgroundColor: '#59A9CC',
        borderRadius: 50,
        padding: 10,
    },
});
