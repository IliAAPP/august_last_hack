import { View, Text, Pressable, TouchableHighlight } from 'react-native';
import React, { useState } from 'react'
import tw from 'twrnc';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../ui/Loader'
import Field from '../ui/Field';
import Button from '../ui/Button';

interface IData {
  email: string;
  password: string;
  phone: string; 
  fullName: string; 
}

const Auth = () => {
  const {isLoading, login, register} = useAuth()
  
  const [data, setData] = useState<IData>({} as IData)
  const [isReg, setIsReg] = useState(false);

  const authHandler = async () => {
    const {email, password, phone, fullName} = data;

    const userData = {
      email,
      password,
      phone,
      fullName
    };

    if(isReg) {
      await register(userData)
    } else {
      await login(email, password)
    }

    setData({} as IData)

  }

  return (
    <View style={tw`h-full w-full bg-white pt-16`}>
      <View style={tw`mx-5 justify-center items-center h-full`}>
        <View style={tw`w-9/12`}>

          <Text style={tw`text-center text-gray-800 text-2xl font-bold mb-2`}>
            {isReg ? 'Зарегистрироваться и войти' : 'Войти'}
          </Text>     

        {isLoading ? <Loader/> : <></>}
        <Field val={data.email} placeholder='Введите ваш email' 
        onChange={val => setData({...data, email: val})}/>

        {isReg && (
            <>
              <Field val={data.phone} placeholder='Введите ваш номер телефона' 
                onChange={val => setData({...data, phone: val})}/>
              <Field val={data.fullName} placeholder='Введите ваше ФИО' 
                onChange={val => setData({...data, fullName: val})}/>
            </>
          )}

        <Field val={data.password} placeholder='Введите пароль' 
        onChange={val => setData({...data, password: val})}
        isSecure={true}/> 

      <TouchableHighlight
        underlayColor="#59A9CC" // Цвет подсветки при нажатии
        onPress={authHandler}
        style={tw`bg-[#59A9CC] p-3 rounded-lg mt-5`} // Стили для кнопки
      >
        <Text style={tw`text-white text-center font-bold`}>
          Lets go!
        </Text>
      </TouchableHighlight>

        <Pressable onPress={() => setIsReg(!isReg)}>
          <Text style={tw`text-gray-800 opacity-30 text-right text-sm`}>
            {isReg? 'Login' : 'Register'}
          </Text>
        </Pressable>

        </View>
      </View>
    </View>
  );
}

export default Auth;
