import React, {useEffect, useState} from "react";
import { View, Text, Alert } from "react-native";
import messaging from '@react-native-firebase/messaging';
import NavBar from "./NavBar";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  
  console.log('Message handled in the background!', remoteMessage);
});


export default function Main({route}){

  const email = route.params.email;

  const data = [];

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }

    const NotificationListener = () => {
      
        messaging().onNotificationOpenedApp(remoteMessage => {  
        
        //   try {
        //   // You can handle the notification here as needed, e.g., navigate to a specific screen
        //   const newObject = {
        //     id: data.length + 1,
        //     name: remoteMessage.notification.title,
        //     address: remoteMessage.notification.body,
        //     email: remoteMessage.data.body,
        //     billId: remoteMessage.data.key_1,
        //     customerToken: remoteMessage.data.key_2
        //   };
        //   setData(prevData => [...prevData, newObject]);
        
        // }
        //  catch (error)
        //   {
        //   console.log('Error while attempting to vibrate:', error);
        // }
        });
      }

      

      useEffect(() => {

        console.log('data:', data);
        requestUserPermission();
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification,
              );
            }

          });
        
        NotificationListener();
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
       
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
       
            // const newObject = {
            //   id: data.length + 1,
            //   name: remoteMessage.notification.title,
            //   address: remoteMessage.notification.body,
            //   email: remoteMessage.data.body,
            //   billId: remoteMessage.data.key_1,
            //   customerToken: remoteMessage.data.key_2

            // };

            // setData(prevData => [...prevData, newObject]);  

          return unsubscribe;


        },[]);    
        
      });
  

    return(
        <View>
          <NavBar message={email}/>
            <Text>this is main</Text>
        </View>
    )
}