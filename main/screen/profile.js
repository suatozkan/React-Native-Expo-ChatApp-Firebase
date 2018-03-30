import React ,{Component} from 'react'
import {View,Text,TouchableOpacity,Dimensions,Image,StyleSheet} from 'react-native'
import * as firebase from 'firebase'

import {BlurView} from 'expo'
import {NavigationActions} from 'react-navigation'

const {width,height}= Dimensions.get('window')

export default class Profile extends Component{
  render(){
    return(

        <Image
          source={{uri:`https://graph.facebook.com/${this.props.navigation.state.params.profile.id}/picture?height=400`}}
          style={{flex:1,width:undefined,height:undefined,alignItems:'center',justifyContent:'flex-start'}}>
            <BlurView tint="dark" intensity={95} style={StyleSheet.absoluteFill,{position:'absolute',left:0,right:0,top:0,bottom:0}}/>
            <View style={{height:130,width:130,borderRadius:65,marginTop:100,alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
              <Image style={{height:120,width:120,borderRadius:60}}
              source={{uri:`https://graph.facebook.com/${this.props.navigation.state.params.profile.id}/picture?height=100`}} />

            </View>
            <Text style={{color:'white',paddingTop:30,fontWeight:'bold',backgroundColor:'transparent',fontSize:20}}>{this.props.navigation.state.params.profile.first_name}
            </Text>

            <Text style={{color:'white',paddingTop:30,backgroundColor:'transparent',fontSize:20}}> about,city, etc... </Text>

            <TouchableOpacity style={{marginTop:40}} onPress={()=>this.props.navigation.goBack(null)}>
            <Text style={{color:'white',backgroundColor:'transparent'}} > Back </Text>
            </TouchableOpacity>

        </Image>

    )
  }

}
