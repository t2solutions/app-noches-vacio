import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Picker, Alert } from 'react-native';
import { SQLiteHelper } from '../helpers/SQLiteHelper';

class SearchScreen extends Component {

  static navigationOptions = {
    title: 'Pirámide de Bioseguridad',
    headerBackTitle: '',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#0060C0',
      borderBottomWidth: 0,
      elevation: null
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      planta: '',
      species: [],
      specieOriginSelected: null,
      specieDestinationSelected: null,
      originZones: [],
      destinationZones: [],
      originZoneSelected: null,
      destinationZoneSelected: null,
      originLevels: [],
      destinationLevels: [],
      originLevelSelected: null,
      destinationLevelSelected: null
    };
  }

  componentDidMount() {
    this.getSpecies();
  }

  getSpecies() {
    SQLiteHelper.getArray("select * from especie", [])
    .then(items => { this.setState({species: items}) })
    .catch(console.log)
  }

  getOriginZones(id_specie) {
    id_specie = 1; //TODO: Remove when database it's complete
    SQLiteHelper.getArray("select * from zona where id_especie=?", [id_specie])
    .then(items => { this.setState({originZones: items}) })
    .catch(console.log)
  }

  getDestinationZones(id_specie) {
    id_specie = 1; //TODO: Remove when database it's complete
    SQLiteHelper.getArray("select * from zona where id_especie=?", [id_specie])
    .then(items => { this.setState({destinationZones: items}) })
    .catch(console.log)
  }

  getOriginLevels(id_specie) {
    SQLiteHelper.getArray("select * from nivel where id_especie=?", [id_specie])
    .then(items => { this.setState({originLevels: items}) })
    .catch(console.log)
  }

  getDestinationLevels(id_specie) {
    SQLiteHelper.getArray("select * from nivel where id_especie=?", [id_specie])
    .then(items => { this.setState({destinationLevels: items}) })
    .catch(console.log)
  }

  renderPicker1() {
    const { species, specieOriginSelected } = this.state;
    return (
      <Picker
        selectedValue={(specieOriginSelected) ? specieOriginSelected.id_especie : null}
        style={{ height: 50, flex: 1 }}
        onValueChange={(itemValue, itemIndex) => {
          this.setState({ specieOriginSelected: species[itemIndex] });
          this.getOriginZones(itemValue);
          this.getOriginLevels(itemValue);
        }}>
        {_.map(species, (specie, index) => {
          return (
            <Picker.Item label={specie.nombre} value={specie.id_especie} key={index}/>
          );
        })}
      </Picker>
    );
  }

  renderPicker2() {
    const { species, specieDestinationSelected } = this.state;
    return (
      <Picker
        selectedValue={(specieDestinationSelected) ? specieDestinationSelected.id_especie : null}
        style={{ height: 50,  flex: 1  }}
        onValueChange={(itemValue, itemIndex) => {
          this.setState({ specieDestinationSelected: species[itemIndex] })
          this.getDestinationZones(itemValue);
          this.getDestinationLevels(itemValue);
        }}>
        {_.map(species, (specie, index) => {
          return (
            <Picker.Item label={specie.nombre} value={specie.id_especie} key={index}/>
          );
        })}
      </Picker>
    );
  }

  renderPicker3() {
    const { originZones, originZoneSelected } = this.state;
    return (
      <Picker
        selectedValue={(originZoneSelected) ? originZoneSelected.id_zona : null}
        style={{ height: 50, flex: 1 }}
        onValueChange={(itemValue, itemIndex) => this.setState({ originZoneSelected: originZones[itemIndex] })}>
        {_.map(originZones, (zone, index) => {
          return (
            <Picker.Item label={zone.descripcion} value={zone.id_zona} key={index}/>
          );
        })}
      </Picker>
    );
  }

  renderPicker4() {
    const { destinationZones, destinationZoneSelected } = this.state;
    return (
      <Picker
        selectedValue={(destinationZoneSelected) ? destinationZoneSelected.id_zona : null}
        style={{ height: 50,  flex: 1  }}
        onValueChange={(itemValue, itemIndex) => this.setState({ destinationZoneSelected: destinationZones[itemIndex] })}>
        {_.map(destinationZones, (zone, index) => {
          return (
            <Picker.Item label={zone.descripcion} value={zone.id_zona} key={index}/>
          );
        })}
      </Picker>
    );
  }

  renderPicker5() {
    const { originLevels, originLevelSelected } = this.state;
    return (
      <Picker
        selectedValue={(originLevelSelected) ? originLevelSelected.id_nivel : null}
        style={{ height: 50, flex: 1 }}
        onValueChange={(itemValue, itemIndex) => this.setState({ originLevelSelected: originLevels[itemIndex] })}>
        {_.map(originLevels, (level, index) => {
          return (
            <Picker.Item label={level.nombre_nivel} value={level.id_nivel} key={index}/>
          );
        })}
      </Picker>
    );
  }

  renderPicker6() {
    const { destinationLevels, destinationLevelSelected } = this.state;
    return (
      <Picker
        selectedValue={(destinationLevelSelected) ? destinationLevelSelected.id_nivel : null}
        style={{ height: 50,  flex: 1  }}
        onValueChange={(itemValue, itemIndex) => this.setState({ destinationLevelSelected: destinationLevels[itemIndex] })}>
        {_.map(destinationLevels, (level, index) => {
          return (
            <Picker.Item label={level.nombre_nivel} value={level.id_nivel} key={index}/>
          );
        })}
      </Picker>
    );
  }

  goToShowScreen() {
    const { navigation } = this.props;
    const { specieOriginSelected, specieDestinationSelected, originZoneSelected, destinationZoneSelected, originLevelSelected, destinationLevelSelected } = this.state;
    const errors = [];
    const values = [];
    if ( !specieOriginSelected ) {
      errors.push('- Especie de Origen');
    } else {
      values.push('Especie de Origen : ' + specieOriginSelected.nombre);
    }
    if ( !specieDestinationSelected ) {
      errors.push('- Especie de Destino');
    } else {
      values.push('Especie de Destino : ' + specieDestinationSelected.nombre);
    }
    if ( !originZoneSelected ) {
      errors.push('- Zona de Origen');
    } else {
      values.push('Zona de Origen : ' + originZoneSelected.descripcion);
    }
    if ( !destinationZoneSelected ) {
      errors.push('- Zona de Destino');
    } else {
      values.push('Zona de Destino : ' + destinationZoneSelected.descripcion);
    }
    if ( !originLevelSelected ) {
      errors.push('- Nivel de Origen');
    } else {
      values.push('Nivel de Origen : ' + originLevelSelected.nombre_nivel);
    }
    if ( !destinationLevelSelected ) {
      errors.push('- Nivel de Destino');
    } else {
      values.push('Nivel de Destino : ' + destinationLevelSelected.nombre_nivel);
    }
    if (errors.length > 0) {
      Alert.alert('Faltan los siguientes datos', errors.join('\n'));
      return;
    }
    Alert.alert(
      '¿Deseas continuar con estos datos?',
      values.join('\n'),
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Continuar', onPress: () => {
          navigation.navigate('ShowStack', {
            P1: 'Pollos',
            P2: 'Cerdos',
          })
        }},
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#EAEAEA'}}>
      <ScrollView style={{flex: 1, backgroundColor: '#EAEAEA'}}>
        <View style={styles.RowContainer}>
          <View style={{flex: 1}}>
            <Text style={{color: '#000000', textAlign: 'left', fontSize: 14}}>Especie de Origen</Text> 
            { this.renderPicker1() }
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: '#000000', textAlign: 'left', fontSize: 14}}>Especie de Destino</Text> 
            { this.renderPicker2() }
          </View>
        </View>
        <View style={styles.RowContainer}>
          <View style={{flex: 1}}>
            <Text style={{color: '#000000', textAlign: 'left', fontSize: 14}}>Zona de Origen</Text> 
            { this.renderPicker3() }
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: '#000000', textAlign: 'left', fontSize: 14}}>Zona de Destino</Text> 
            { this.renderPicker4() }
          </View>
        </View>
        <View style={styles.RowContainer}>
          <View style={{flex: 1}}>
            <Text style={{color: '#000000', textAlign: 'left', fontSize: 14}}>Nivel de Origen</Text> 
            { this.renderPicker5() }
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: '#000000', textAlign: 'left', fontSize: 14}}>Nivel de Destino</Text> 
            { this.renderPicker6() }
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
      onPress={() => {
        this.goToShowScreen();
      }}
      style={styles.btn}>
        <Text style={styles.btnText}>CALCULAR</Text>        
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
    padding: 20,
    height: 200
  },
  btn: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FF6F0D',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  btnText: {
    flex: 1,
    fontSize: 20,
    color:"white",
    textAlign: 'center'
  },
  txt: {
    fontSize:22,
    color:"white"

  }

})