import Expo, {Notifications,Permissions} from 'expo'
import {AsyncStorage,Alert} from 'react-native'

export default async (tokenAll) =>{
  let previousToken= await AsyncStorage.getItem('pushtoken')

  if(previousToken){
    return
  } else{
    let{status}= await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if(status!=='granted'){
        return
      }
    let token = await Notifications.getExpoPushTokenAsync()
    AsyncStorage.setItem('pushtoken',token)
  }
}
