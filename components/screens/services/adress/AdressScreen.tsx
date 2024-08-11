import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import tw from "twrnc";
import Footer from "../../Footer";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { Calendar, DateObject } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";

const ServicesScreen = () => {
    const [fontsLoaded] = useFonts({
        "SFProDisplay-Regular": require("../../../../../assets/fonts/SF-Pro-Display-Regular.otf"),
    });
    const [selectedDates, setSelectedDates] = useState({});
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    const chargingLocations = [
        { date: "28.05", address: "ул. Рашпилевская 343 (НЭСК)" },
        { date: "22.05", address: "ул. Северная 44 (НЭСК)" },
        { date: "20.05", address: "ул. Красная 21 (Рост)" },
        { date: "18.05", address: "ул. Ставропольская 212 (НЭСК)" },
        { date: "8.05", address: "ул. Красная 4 (Рост)" },
    ];

    if (!fontsLoaded) {
        return <View />; // Или отобразите экран загрузки
    }

    const navigation = useNavigation();

    const handleDateSelect = (date) => {
        const formattedDate = date.dateString;
        const newSelectedDates = { ...selectedDates };

        if (newSelectedDates[formattedDate]) {
            delete newSelectedDates[formattedDate];
        } else {
            newSelectedDates[formattedDate] = { selected: true, color: "blue" };
        }

        setSelectedDates(newSelectedDates);
    };

    const formatSelectedDates = () => {
        const formattedDates = Object.keys(selectedDates).map((date) => {
            const formattedDate = new Date(date);
            const month = formattedDate.toLocaleString("default", {
                month: "long",
            });
            const year = formattedDate.getFullYear();
            return `${month} - ${year}`;
        });

        return formattedDates.join(", ");
    };

    return (
        <>
            <View style={[tw`flex-1 justify-center items-center bg-white `]}>
                <View style={tw`w-full px-4`}>
                    <View style={tw`mb-6`}>
                        <Text
                            style={[
                                tw`text-[40px] font-bold text-center`,
                                { fontFamily: "SFProDisplay-Regular" },
                            ]}
                        >
                            Адреса
                        </Text>
                    </View>

                    <View
                        style={tw`flex-col bg-white pb-4 rounded-[36px] mb-4 shadow-lg`}
                    >
                        <View>
                            <Text
                                style={tw`text-lg font-bold pt-3 text-center text-[#101D8E]`}
                            >
                                История заряда
                            </Text>
                            <View
                                style={tw`flex-row justify-center gap-2 mt-2`}
                            >
                                <FontAwesome
                                    name="long-arrow-left"
                                    size={18}
                                    color="black"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowCalendarModal(true)}
                                >
                                    <Text style={tw`text-center`}>
                                        {formatSelectedDates() || "май 2024"}
                                    </Text>
                                </TouchableOpacity>
                                <FontAwesome
                                    name="long-arrow-right"
                                    size={18}
                                    color="black"
                                />
                            </View>
                        </View>
                        <View style={tw`flex justify-start mt-4`}>
                            <FlatList
                                data={chargingLocations}
                                keyExtractor={(item) => item.date}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text
                                            style={tw`mt-2 mb-1 ml-40 text-gray-500`}
                                        >
                                            улица (компания)
                                        </Text>
                                        <View
                                            style={tw`flex-row justify-between items-center py-2`}
                                        >
                                            <Text
                                                style={tw`ml-10 text-gray-400`}
                                            >
                                                {item.date}
                                            </Text>
                                            <Text style={tw`mr-10`}>
                                                {item.address}
                                            </Text>
                                        </View>
                                        <View
                                            style={tw`border-b border-gray-200`}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    <TouchableOpacity>
                        <View style={tw`mt-30`}>
                            <Text style={tw`text-gray-400 text-center`}>
                                Назад
                            </Text>
                            <FontAwesome
                                name="long-arrow-left"
                                size={20}
                                color="gray"
                                style={tw`text-center`}
                                onPress={() =>
                                    navigation.navigate("ServicesScreen")
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showCalendarModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCalendarModal(false)}
            >
                <View
                    style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
                >
                    <View style={tw`bg-white rounded-lg p-4`}>
                        <Calendar
                            onDayPress={handleDateSelect}
                            markedDates={selectedDates}
                            markingType={"multi-period"}
                        />
                        <TouchableOpacity
                            style={tw`mt-4 py-2 px-4 bg-blue-500 rounded`}
                            onPress={() => setShowCalendarModal(false)}
                        >
                            <Text style={tw`text-white font-bold`}>Готово</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Footer />
        </>
    );
};

export default ServicesScreen;
