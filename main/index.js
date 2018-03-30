import React ,{Component} from 'react';
import { StackNavigator } from 'react-navigation'
import * as firebase from 'firebase'
import Home from './screen/home'
import Login from './screen/login'
import Chat from './screen/chat'
import Profile from './screen/profile'

const firebaseConfig={

  apiKey:"XXXXXXXXXXX",
  databaseURL:"https://AAAAA.firebaseio.com"
}
firebase.initializeApp(firebaseConfig)

const RouteConfigs={
  Login:{screen:Login},
  Home:{screen:Home},
  Chat:{screen:Chat},
  Profile:{screen:Profile}
}

const StackNavigatorConfig={
  headerMode:'none'
}

export default StackNavigator(RouteConfigs,StackNavigatorConfig)
