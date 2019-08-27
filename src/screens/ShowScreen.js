import React, { Component } from 'react';
import Modal from "react-native-modal";
import Dimensions from 'Dimensions';
import {  KeyboardAvoidingView, TextInputStyleSheet,Text, View,StyleSheet,TouchableOpacity,Image,TouchableHighlight,ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import SearchInput, { createFilter } from 'react-native-search-filter';
 
export default class ShowScreen extends Component {
  static navigationOptions= ({navigation}) =>({
		headerStyle:{
		  backgroundColor: 'transparent', 
		  zIndex: 100,  
		},
		headerTransparent: true,
	});


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  constructor(props) {
    super(props);   
    this.state = {
      tableHead: ['Planta', 'Nivel','Noches \n de Vacío','\t Acceso',''],
      tableData: [
        ['Pollos', '2', '2', ' Denegado',
        
        <Image style= {{flex:1 , width: undefined, height: undefined,resizeMode:'contain'}}   source={require('../../assets/Pollo_Small_BAD.png')} />],
        ['Pollos', '3', '0', ' Denegado',<Image style= {{flex:1 , width: undefined, height: undefined,resizeMode:'contain'}}   source={require('../../assets/Pollo_Small_BAD.png')} />],
        ['Pollos', '4', '1', ' Permitido',<Image style= {{flex:1 , width: undefined, height: undefined,resizeMode:'contain'}}   source={require('../../assets/Pollo_Small_OK.png')} />],
        ['Pollos', '1', '3', ' Denegado',<Image style= {{flex:1 , width: undefined, height: undefined,resizeMode:'contain'}}   source={require('../../assets/Pollo_Small_BAD.png')} />]
      ],
      modalVisible: false,
    }
  }
 
  render() {
    var P1 = this.props.navigation.getParam('P1');
    var P2 = this.props.navigation.getParam('P2');
    const state = this.state;
    return (


    
      <View style={styles.container}>

        {/*
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Soy la búsqueda</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Ocultar Búsqueda</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        */}
        {/*
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>
          Mostrar Búsqueda
          </Text>
        </TouchableHighlight>
         */}

       
         <Text>{'\n'}Desde planta {P1} al DD/MM/AAAA{'\n'}Destino {P2} al DD/MM/AAAA{'\n'}</Text> 

        <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={state.tableData} textStyle={styles.text}/>
        </Table>

        <TouchableOpacity
					onPress={() => this.props.navigation.navigate('SearchStack')} //MainStack
					style={styles.btn}>
					<Text style={styles.btnText}>Volver</Text>
				</TouchableOpacity>

      </View>
    )
  }
}


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;



 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 6, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 70, backgroundColor: '#f1f8ff',width:300},
  text: { marginLeft: 0,width:100,height:40 },

  btn:{
		alignItems: 'center',
		justifyContent: 'center',
        backgroundColor: 'orange',
		width: DEVICE_WIDTH - 180,
		height: 40,
    	borderRadius: 10,
    padding:10,
    marginTop:50,
		marginLeft:150,
	},
	btnText:{
		color: 'white',
		backgroundColor: 'transparent',
		fontWeight:'bold'
  },

  Image:{
    width: 5,
    height:5

  }
  


});