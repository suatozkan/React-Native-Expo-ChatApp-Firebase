import React,{Component} from 'react'

import {View,Text,TouchableOpacity} from 'react-native'
import {NavigationActions} from 'react-navigation'
import * as firebase from 'firebase'

import { GiftedChat } from 'react-native-gifted-chat'

export default class Chat extends Component{
  state={
    messages:[],
    user:this.props.navigation.state.params.user,
    profile:this.props.navigation.state.params.profile,
    tokenS:''
  }

  componentWillMount(){
    const {user,profile}=this.state
    this.chatID= user.uid > profile.uid? user.uid+'-'+profile.uid:profile.uid+'-'+user.uid
    this.watchChat()
    firebase.database().ref('users').child(this.state.profile.uid).child('token').once('value',snap=>{
      const tokenInfo= snap.val()
      this.setState({tokenS:tokenInfo})
    })

  }

  watchChat=()=>{
    firebase.database().ref('messages').child(this.chatID).on('value',snap=>{
      let messages=[]
      snap.forEach(message=>{
        messages.push(message.val())
      })
      messages.reverse()
      this.setState({messages})
    })

  }

  onSend=(message)=>{
    const {user,profile}=this.state
    relationMessage={}
    firebase.database().ref('messages').child(this.chatID).push({...message[0],createdAt:new Date().getTime(),
    })
    firebase.database().ref('pushList').push({
      msg:message[0].text,
      tokens:this.state.tokenS,
      msgHeader:this.state.user.first_name,
      // now the push is ready. when you send message to other users, they will get push notification:)
    })
  }

  render(){
    const {user,profile}=this.state
    const avatar = `https://graph.facebook.com/${user.uid}/picture?height=80`
    return(
      <View style={{flex:1}}>
        <GiftedChat
          messages={this.state.messages}
          user={{_id:user.uid,avatar}}
          onSend={this.onSend}
          />

          <View style={{position:'absolute',top:20,left:10,backgroundColor:'transparent'}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack(null)}>
          <Text>Back</Text>
          </TouchableOpacity>

          </View>

          <View style={{position:'absolute',top:20,right:10,backgroundColor:'transparent'}}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Profile',{profile:this.state.profile})}>
          <Text style={{fontWeight:'bold'}}>{this.state.profile.first_name}</Text>
          </TouchableOpacity>

          </View>

      </View>

    )
  }


}
