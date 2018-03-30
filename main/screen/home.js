import React from 'react';
import Expo,{Notifications,Permissions} from 'expo'


import { StyleSheet, Text, View,FlatList,Image,TouchableOpacity,Dimensions,AsyncStorage } from 'react-native';
import * as firebase from 'firebase'
import {NavigationActions} from 'react-navigation'
import registerForNotifications from '../services/push_notifications'
const {width,height}=Dimensions.get('window')

export default class Home extends React.Component {

  state={
    userList:[]
  }

  componentWillMount(){

    registerForNotifications()

    Notifications.addListener((notification)=>{
      const {data:{withSome},origin} = notification
      if(origin==='selected'){
        //if you want to route when you click the push or smthg like that..
      }
    })

    AsyncStorage.getItem('pushtoken',(err,result)=>{
      tokenSendDatabase={}
      tokenSendDatabase[`${this.props.navigation.state.params.user.uid}/token`]=result
      firebase.database().ref('users').update(tokenSendDatabase)
      // this part is for messaging to get token info from other users' datas
    })



    firebase.database().ref().child('users').once('value',(snap)=>{
      let userList=[]
      snap.forEach((user)=>{
        const {first_name,id,uid}= user.val()
        userList.push({first_name,id,uid})
      })
      this.setState({userList})
    })
  }

  LogOut(){
    firebase.auth().signOut()
    const resetAction=NavigationActions.reset({
      index:0,
      actions:[
        NavigationActions.navigate({routeName:'Login'})
      ]

    })
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    return (
      <View style={styles.container}>

      <View style={{alignItems:'center',justifyContent:'center',width:width-40,paddingBottom:10}}>
        <Text style={{color:'grey',fontWeight:'bold'}}>Chat</Text>
      </View>

        <FlatList
        data={this.state.userList}
        keyExtractor={(item,index)=>item.first_name}
        renderItem={({item})=>

        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Chat',{user:this.props.navigation.state.params.user,profile:item})} >
        <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row',padding:5,width:width}}>

          <Image style={{height:40,width:40,borderRadius:20}}
          source={{uri:`https://graph.facebook.com/${item.id}/picture?height=100`}} />

          <View style={{alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'grey',fontWeight:'bold'}}>{item.first_name}</Text>

          </View>

        </View>

        <View style={{width:width,height:1,backgroundColor:'darkgrey'}} />

        </TouchableOpacity>
      } />

        <TouchableOpacity onPress={()=>this.LogOut()  }>
        <Text>log Out</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  padding:20
  },
});
