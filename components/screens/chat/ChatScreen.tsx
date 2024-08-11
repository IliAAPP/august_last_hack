import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

// Импортируйте локальные аватары
const avatar1 = require('../../../assets copy/avatar_chat1.jpg'); // Убедитесь, что путь к изображению корректен
const avatar2 = require('../../../assets copy/avatar_chat2.jpg'); // Убедитесь, что путь к изображению корректен

interface Message {
    id: string;
    text: string;
    user: {
        name: string;
        avatar: any; // Локальные аватары с использованием `any`
    };
    isUserMessage?: boolean;
}

const initialMessages: Message[] = [
    {
        id: "1",
        text: "Добрый день, как вам удобно...",
        user: {
            name: "Вы",
            avatar: avatar1,
        },
        isUserMessage: true,
    },
    {
        id: "2",
        text: "В каком формате вы хотите получить ответ?",
        user: {
            name: "Работодатель",
            avatar: avatar2,
        },
    },
    {
        id: "3",
        text: "Добрый день! Получили ваш запрос.",
        user: {
            name: "Работодатель",
            avatar: avatar2,
        },
    },
];

const ChatScreen: React.FC = () => {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const handleSendMessage = async () => {
    if (inputText.trim()) {
        const sentences = inputText.split('.').map(sentence => sentence.trim()).filter(sentence => sentence); // Разделяем текст на предложения

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            user: {
                name: "Вы",
                avatar: avatar1,
            },
            isUserMessage: true,
        };

        // Добавляем новое сообщение пользователя в чат
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
        setInputText("");

        try {
            // Отправляем текст на сервер для проверки
            const response = await fetch('http://10.2.0.152:8000/check-contradictions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentences }), // Отправляем массив предложений
            });

            const result = await response.json();

            // Отладочные сообщения
            console.log("Ответ от сервера:", result);

            // Проверяем, получили ли корректные данные
            const validityPercentage = result.validity_percentage !== undefined 
                ? result.validity_percentage.toFixed(2) 
                : "неизвестен";

            const contradictionsFound = result.contradictions_found !== undefined 
                ? result.contradictions_found 
                : "неизвестно";

            // Добавляем результат проверки в чат
            const resultMessage: Message = {
                id: Date.now().toString(),
                text: `Результат проверки: ${validityPercentage}% - Противоречий найдено: ${contradictionsFound}`,
                user: {
                    name: "Нейросеть",
                    avatar: avatar2, // Здесь вы можете использовать другой аватар для нейросети
                },
            };

            setMessages((prevMessages) => [resultMessage, ...prevMessages]);

        } catch (error) {
            console.error("Ошибка при проверке текста:", error);
            // Вы можете добавить сообщение об ошибке в чат, если хотите
            const errorMessage: Message = {
                id: Date.now().toString(),
                text: "Произошла ошибка при проверке текста. Пожалуйста, попробуйте еще раз.",
                user: {
                    name: "Система",
                    avatar: avatar2,
                },
            };

            setMessages((prevMessages) => [errorMessage, ...prevMessages]);
        }
    }
};

    
    
    

    const renderMessageItem = ({ item }: { item: Message }) => {
        const messageStyle = item.isUserMessage
            ? [tw`items-end`, styles.messageContainerRight]
            : tw`items-start`;

        return (
            <View style={[tw`flex-row mb-2`, messageStyle]}>
                <Image
                    source={item.user.avatar}
                    style={[
                        tw`w-10 h-10 rounded-full`,
                        item.isUserMessage ? { marginRight: 5 } : { marginLeft: 5 }, // Увеличиваем отступ на 3 пикселя
                    ]}
                />
                <View style={tw`max-w-3/4`}>
                    {item.isUserMessage && (
                        <Text style={tw`text-sm text-gray-600`}>
                            {item.user.name}
                        </Text>
                    )}
                    <View
                        style={[
                            tw`flex-row`,
                            item.isUserMessage && {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                tw`text-base bg-white p-2 rounded-lg`
                            ]}
                        >
                            {item.text}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            <View style={tw`flex-1 p-4`}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessageItem}
                    inverted
                />
            </View>
            <View style={tw`flex-row items-center border rounded-md p-2`}>
                <TextInput
                    style={tw`flex-1 h-10 bg-white px-4 rounded-full`}
                    onChangeText={setInputText}
                    value={inputText}
                    placeholder="Напишите сообщение..."
                />
                <TouchableOpacity
                    onPress={() => setInputText(inputText + "😊")}
                >
                    <Text style={tw`text-2xl mx-2`}>😊</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="blue" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    messageContainerRight: {
        flexDirection: "row-reverse",
    },
});

export default ChatScreen;
