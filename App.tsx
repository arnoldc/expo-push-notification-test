import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true
        } 
    }
})

export default function App() {
    const [pushToken, setPushToken] = useState<string>();

    useEffect(async () => {
          const data = await Notifications.getExpoPushTokenAsync();
          setPushToken(data.data)
    }, [])

    useEffect(() => {
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('background ', response)
        });

          const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
              console.log('foreground', notification)
          });

          return () => {
            foregroundSubscription.remove();
            backgroundSubscription.remove();
          }
    }, [])

  const triggerNotificationHandler = () => {
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //        title: 'My first local notification',
        //        body: 'this is the first local notification we are sending',
        //        data: {
        //           mydata: 'hey yo'
        //        }
        //     },
        //     trigger: {
        //         seconds: 10
        //     }
        // });
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
             headers: {
                  'Accept': 'application/json',
                  'Accept-Encoding': 'gzip, deflate',
                  'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                to: pushToken,
                data: {
                    mydata: 'hey hey'
                },
                title: 'sent via the app',
                body: 'sent via the app body!!!'
             })
        })
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Pressable onPress={triggerNotificationHandler} style={styles.button}>
            <Text> Trigger Notification</Text>
        </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding : 10,
    backgroundColor: '#ff0',
    borderRadius: 5,
    marginTop: 20,
  }
});
