import React, {useState, useEffect} from 'react';
import { Text, View, Button, Alert } from 'react-native';
import {css} from './assets/css/Css';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {Home,Login,Rastreio} from './views';
import AreaRestrita from "./views/arearestrita/AreaRestrita";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';
import config from './config/config';



export default function App() {
  const Stack = createStackNavigator();
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(()=>{
    registerForPushNotificationsAsync();
  },[]);
  
  useEffect(()=>{
    if(expoPushToken != null){
        sendToken();
    }
  },[expoPushToken]);
  
  
  //Registra o token do usuário
  async function registerForPushNotificationsAsync(){
      if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
              const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
              finalStatus = status;
          }
          if (finalStatus !== 'granted') {
              alert('Failed to get push token for push notification!');
              return;
          }
          const token = await Notifications.getExpoPushTokenAsync();
          setExpoPushToken(token);
      } else {
          alert('Must use physical device for Push Notifications');
      }
  
      if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
              name: 'default',
              sound: true,
              priority: 'max',
              vibrate: [0, 250, 250, 250],
          });
      }
  }
  
   //Envio do token
  async function sendToken()
  {
      let response=await fetch(config.urlRoot+'token',{
          method:'POST',
          headers:{
              Accept:'application/json',
              'Content-Type':'application/json'
          },
          body: JSON.stringify({
              token: expoPushToken
          })
      });
  }

  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                  title:"SMSLog",
                  headerStyle:{backgroundColor:"#D3D3D3"},
                  headerTintColor:'#333',
                  headerTitleStyle:{fontWeight:'bold', alignSelf:'center'}
              }}
          />
      <Stack.Screen name="Login" options={{headerShown:false}} component={Login} />
      <Stack.Screen name="Rastreio" component={Rastreio} />
      {<Stack.Screen name="AreaRestrita" options={{headerShown:false}} component={AreaRestrita} />}
    </Stack.Navigator>
  </NavigationContainer>
  );
}


