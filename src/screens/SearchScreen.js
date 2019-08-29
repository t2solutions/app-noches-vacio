import React, { Component } from 'react';

import { Platform, FlatList,LayoutAnimation, StyleSheet, View, Text, ScrollView, UIManager, TouchableOpacity, Picker } from 'react-native';

import { SQLite } from 'expo-sqlite';

import * as FileSystem from 'expo-file-system';

const bd = FileSystem.documentDirectory + '/SQLite/agrosuper.db'

const db = SQLite.openDatabase('bd','p','Agrosuper','66');

if(db==true)

{

 //console.log(bd);
}



db.transaction(
  tx => {
    tx.executeSql(`select * from Rol`);
    console.log(db);
   
  }

   

);




class SearchScreen extends Component {
  state = {planta: ''}
  
  updatePlanta = (planta) => {
     this.setState({ planta: planta_origen })
     this.setState({ planta: planta_destino })
  }

  updateNivel = (nivel) => {
    this.setState({ nivel: nivel_origen })
    this.setState({ nivel: nivel_destino })
 }


 updateEstrato = (estrato) => {
  this.setState({ estrato: estrato_origen })
  this.setState({ estrato: estrato_destino })
}

  render() {
   
    return (

      <View style={{flex: 1, flexDirection: 'column', marginTop:0}}>
    
    <View style={styles.RowContainer}>

    <Picker

    selectedValue={this.state.planta_origen}
    style={{ height: 50, width: 100 }}
    onValueChange={(itemValue, itemIndex) => this.setState({ planta_origen: itemValue })}>
  
  <Picker.Item label="Pollos" value="pollos1" />
  <Picker.Item label="Cerdos" value="cerdos1" />
  <Picker.Item label="Pavos" value="pavos1" />

  
  </Picker>

  <Picker

    selectedValue={this.state.planta_destino}
    style={{ height: 50, width: 100 }}
    onValueChange={(itemValue, itemIndex) => this.setState({ planta_destino: itemValue })}>
    
   <Picker.Item label="Pollos" value="pollos2" />
  <Picker.Item label="Cerdos" value="cerdos2" />
  <Picker.Item label="Pavos" value="pavos2" />

  </Picker>



    
</View>


<View style={styles.RowContainer}>

<Picker
selectedValue={this.state.nivel_origen}
style={{ height: 50, width: 100 }}
onValueChange={(itemValue, itemIndex) => this.setState({ nivel_origen: itemValue })}>
<Picker.Item label="N1" value="ni1" />
<Picker.Item label="N2" value="ni2" />
<Picker.Item label="N3" value="ni3" />
<Picker.Item label="N4" value="ni4" />
<Picker.Item label="N5" value="ni5" />


</Picker>
<Picker
selectedValue={this.state.nivel_destino}
style={{ height: 50, width: 100 }}
onValueChange={(itemValue, itemIndex) => this.setState({ nivel_destino: itemValue })}>
<Picker.Item label="N1" value="nf1" />
<Picker.Item label="N2" value="nf2" />
<Picker.Item label="N3" value="nf3" />
<Picker.Item label="N4" value="nf4" />
<Picker.Item label="N5" value="nf5" />


</Picker>



</View>

<View style={styles.RowContainer}>

<Picker
selectedValue={this.state.estrato_origen}
style={{ height: 50, width: 100 }}
onValueChange={(itemValue, itemIndex) => this.setState({ estrato_origen: itemValue })}>
<Picker.Item label="Coya 1" value="coya1_origen" />
<Picker.Item label="Coya 2" value="coya2_origen" />
<Picker.Item label="Coya 3" value="coya3_origen" />

</Picker>


<Picker

selectedValue={this.state.estrato_destino}
style={{ height: 50, width: 100 }}
onValueChange={(itemValue, itemIndex) => this.setState({ estrato_destino: itemValue })}>
<Picker.Item label="Coya 1" value="coya1_destino" />
<Picker.Item label="Coya 2" value="coya2_destino" />
<Picker.Item label="Coya 3" value="coya3_destino" />

</Picker>



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
export default SearchScreen

const styles = StyleSheet.create({
  text: {
     fontSize: 30,
     alignSelf: 'center',
     color: 'red'
  },
  RowContainer: {
  flex: 1, 
  flexDirection: 'row',
  justifyContent:'space-around'
  },
  btn: {
    padding: 10,
    backgroundColor: '#FF6F00',
    width:200,
    marginLeft:60,
    marginBottom:0
  },
  txt: {

    fontWeight:"bold",
    fontSize:10,
    color:"green"

  }

})