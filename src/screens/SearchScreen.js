import React, { Component } from 'react';

import { Platform, FlatList,LayoutAnimation, StyleSheet, View, Text, ScrollView, UIManager, TouchableOpacity } from 'react-native';

class Accordion_Panel extends Component {

  constructor() {

    super();

    this.state = {

      updated_Height: 0

    }
  }

  componentWillReceiveProps(update_Props) {
    if (update_Props.item.expanded) {
      this.setState(() => {
        return {
          updated_Height: null
        }
      });
    }
    else {
      this.setState(() => {
        return {
          updated_Height: 0
        }
      });
    }
  }

  shouldComponentUpdate(update_Props, nextState) {

    if (update_Props.item.expanded !== this.props.item.expanded) {

      return true;

    }

    return false;

  }

  render() {

    return (

      <View style={styles.Panel_Holder}>

        <TouchableOpacity activeOpacity={0.7} onPress={this.props.onClickFunction} style={styles.Btn}>

          <Text style={styles.Panel_Button_Text}>{this.props.item.title} </Text>

        </TouchableOpacity>

        <View style={{ height: this.state.updated_Height, overflow: 'hidden' }}>

          <Text style={styles.Panel_text}>

            {this.props.item.body}

          </Text>

        </View>

      </View>

    );
  }
}

export default class SearchScreen extends Component {

  constructor() {
    super();

    if (Platform.OS === 'android') {

      UIManager.setLayoutAnimationEnabledExperimental(true)

    }

    const array2 = [

      { expanded: false, title: "Planta", body:"Pollos \nCerdos\nPavos"
      
    
    },
      { expanded: false, title: "Nivel", body: "N1\n\N2\nN3\nN4\nN5" },
      { expanded: false, title: "Estrato", body: "Coya1\nCoya2\nCoya3\nCoya4" },
     

    ];

    this.state = { 
        
    AccordionData: [...array2] 
    
    
    
    }
    }

  update_Layout = (index) => {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const array = this.state.AccordionData.map((item) => {

      const newItem = Object.assign({}, item);

      newItem.expanded = false;

      return newItem;
    });

    array[index].expanded = true;

    this.setState(() => {
      return {
        AccordionData: array
      }
    });
  }

  render() {
    return (

      <View style={{ flex:1, FlexDirection:'column',  justifyContent: 'center', marginTop:0 }}>

      
      <View style={styles.MainContainer}>

      

        <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          {
            this.state.AccordionData.map((item, key) =>
              (
                <Accordion_Panel key={key} onClickFunction={this.update_Layout.bind(this, key)} item={item} />
              ))
          }
        </ScrollView>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          {
            this.state.AccordionData.map((item, key) =>
              (
                <Accordion_Panel key={key} onClickFunction={this.update_Layout.bind(this, key)} item={item} />
              ))
          }
        </ScrollView>   

          
       

    
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ShowStack', {
                          P1: 'Pollos',
                          P2: 'Cerdos',
                       })} //MainStack
          style={styles.btn}>
          <Text style={styles.btnText}>Calcular noches de vacío</Text>        
        </TouchableOpacity>

        
      </View>



     

      
    );


  }




  
}

const styles = StyleSheet.create({

  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    width: 300,
    flexDirection: 'row'
  },

  Panel_text: {
    fontSize: 18,
    color: '#000',
    padding: 10
  },

  Panel_Button_Text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 21
  },

  Panel_Holder: {
    borderWidth: 1,
    borderColor: '#FF6F00',
    marginVertical: 5
  },

  Btn: {
    padding: 10,
    backgroundColor: '#FF6F00'
  },

  btn: {
    padding: 10,
    backgroundColor: '#FF6F00',
    width:200,
    marginLeft:60,
    marginBottom:100
  },
	btnText:{
		color: 'black',
		backgroundColor: 'transparent',
		fontWeight:'bold'
  },
 






});