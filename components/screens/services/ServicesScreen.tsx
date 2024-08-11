import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import tw from "twrnc";
import Footer from "../Footer";
import AdressScreen from "./adress/AdressScreen";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import React, { useState, FC } from "react";

interface ISelectedDates {
    [key: string]: { selected: boolean; color: string };
  }

const ServicesScreen: FC = () => {
    const [fontsLoaded] = useFonts({
        "SFProDisplay-Regular": require("../../../../assets/fonts/SF-Pro-Display-Regular.otf"),
    });
    const [selectedDates, setSelectedDates] = useState({});
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    if (!fontsLoaded) {
        return <View />; // Или отобразите экран загрузки
    }
    const navigation = useNavigation();
    const handleDateSelect = (date: { dateString: string }) => {
        const formattedDate = date.dateString;
        const newSelectedDates: ISelectedDates = { ...selectedDates };

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
                            Сервисы
                        </Text>
                    </View>

                    <View
                        style={tw`flex-col bg-white pb-4 rounded-[36px] mb-4 shadow-lg`}
                    >
                        <View style={tw`mb-4`}>
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
                        <View style={tw` `}>
                            <View style={tw`flex flex-row`}>
                                <View style={tw`ml-2`}>
                                    <MaterialIcons
                                        name="electrical-services"
                                        size={24}
                                        color="black"
                                    />
                                </View>
                                <View>
                                    <Text style={tw`ml-2`}>
                                        Потреблено, кВт*ч
                                    </Text>
                                    <Text style={tw`pt-1 pb-2 ml-6  font-bold`}>
                                        20,09 кВт*ч
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={tw`border-t-[1px] border-slate-200 flex flex-row`}
                            >
                                <View style={tw`ml-2 pt-3`}>
                                    <Ionicons
                                        name="wallet-outline"
                                        size={24}
                                        color="black"
                                    />
                                </View>
                                <View>
                                    <Text style={tw`ml-2 pt-2`}>
                                        Потрачено, ₽
                                    </Text>
                                    <Text style={tw`pt-1 pb-2 ml-6 font-bold`}>
                                        356,09 ₽
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={tw`border-t-[1px] border-slate-200`}
                                onPress={() =>
                                    navigation.navigate("AdressScreen")
                                }
                            >
                                <View style={tw``}>
                                    <View style={tw`relative `}>
                                        <View style={tw`absolute mt-3 ml-2`}>
                                            <FontAwesome
                                                name="map-o"
                                                size={24}
                                                color="black"
                                            />
                                        </View>
                                        <View style={tw`flex-none`}>
                                            <Text style={tw`ml-10 pt-2  `}>
                                                Места зарядки
                                            </Text>
                                            <View
                                                style={tw`flex justify-between flex-row pr-5`}
                                            >
                                                <Text
                                                    style={tw`pt-1 pb-2 ml-14 font-bold`}
                                                >
                                                    Адреса
                                                </Text>
                                                <FontAwesome
                                                    name="long-arrow-right"
                                                    size={18}
                                                    color="black"
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View
                                        style={tw`pb-5 border-t-[1px] border-slate-200`}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View
                        style={tw`bg-white shadow-lg pb-4 pt-4 mt-3 rounded-[36px] mb-4`}
                    >
                        <Text
                            style={tw`text-lg font-bold text-center text-[#101D8E]`}
                        >
                            Счёт
                        </Text>
                        <View
                            style={tw`flex justify-between mt-4 flex-row pb-2`}
                        >
                            <Text style={tw`font-bold pl-6 text-2xl`}>
                                237.87 ₽
                            </Text>
                            <Text style={tw`text-right pr-4 text-gray-300`}>
                                Автопополнение
                            </Text>
                        </View>
                        <View
                            style={tw`pb-3 border-t-[1px] border-slate-200`}
                        ></View>
                        <TouchableOpacity
                            style={tw`mt-2 bg-[#100D94] ml-6 mb-4 py-2 rounded-[11px] w-[130px]`}
                        >
                            <Text
                                style={[
                                    tw`text-white text-4 text-center`,
                                    { fontFamily: "SFProDisplay-Regular" },
                                ]}
                            >
                                Пополнить
                            </Text>
                        </TouchableOpacity>
                    </View>
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
