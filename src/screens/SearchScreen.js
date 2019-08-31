import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Picker, Alert } from 'react-native';
import { SQLiteHelper } from '../helpers/SQLiteHelper';
import { NVInputDropdown } from '../modules'

class SearchScreen extends Component {

  static navigationOptions = {
    title: 'Pirámide de Bioseguridad',
    headerBackTitle: ' ',
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
      user: null,
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
      destinationLevelSelected: null,
      originSubLevels: [],
      destinationSubLevels: [],
      originSubLevelSelected: null,
      destinationSubLevelSelected: null
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.getSpecies();
    const user = navigation.getParam('user');
    this.setState({user: user});
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

  getOriginSubLevels() {
    const { originZoneSelected, originLevelSelected } = this.state;
    if (!originZoneSelected || !originLevelSelected) {
      return
    }
    SQLiteHelper.getArray("select * from subnivel where id_zona=? and id_nivel=?", [originZoneSelected.id_zona , originLevelSelected.id_nivel])
    .then(items => { this.setState({originSubLevels: items}) })
    .catch(console.log)
  }

  getDestinationSubLevels() {
    const { destinationZoneSelected, destinationLevelSelected } = this.state;
    if (!destinationZoneSelected || !destinationLevelSelected) {
      return
    }
    SQLiteHelper.getArray("select * from subnivel where id_zona=? and id_nivel=?", [destinationZoneSelected.id_zona , destinationLevelSelected.id_nivel])
    .then(items => { this.setState({destinationSubLevels: items}) })
    .catch(console.log)
  }

  renderPicker1() {
    const { species, specieOriginSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Origen"
        items={species}
        type={0}
        onSelect={ itemValue => {
          this.setState({ specieOriginSelected: itemValue, originZoneSelected: null, originLevelSelected: null, originLevelSubSelected: null, originSubLevels: [] });
          this.getOriginZones(itemValue.id_especie);
          this.getOriginLevels(itemValue.id_especie);
        }} 
        selected={(specieOriginSelected) ? specieOriginSelected.nombre : null } />
    );
  }

  renderPicker2() {
    const { species, specieDestinationSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Destino"
        items={species}
        type={0}
        onSelect={ itemValue => {
          this.setState({ specieDestinationSelected: itemValue, destinationZoneSelected: null, destinationLevelSelected: null, destinationSubLevelSelected: null, destinationSubLevels: [] });
          this.getDestinationZones(itemValue.id_especie);
          this.getDestinationLevels(itemValue.id_especie);
        }} 
        selected={(specieDestinationSelected) ? specieDestinationSelected.nombre : null } />
    );
  }

  renderPicker3() {
    const { originZones, originZoneSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Origen"
        items={originZones}
        type={1}
        onSelect={ itemValue => {
          this.setState({ originZoneSelected: itemValue });
          this.getOriginSubLevels();
        }} 
        selected={(originZoneSelected) ? originZoneSelected.descripcion : null } />
    );
  }

  renderPicker4() {
    const { destinationZones, destinationZoneSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Destino"
        items={destinationZones}
        type={1}
        onSelect={ itemValue => {
          this.setState({ destinationZoneSelected: itemValue });
          this.getDestinationSubLevels();
        }} 
        selected={(destinationZoneSelected) ? destinationZoneSelected.descripcion : null } />
    );
  }

  renderPicker5() {
    const { originLevels, originLevelSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Destino"
        items={originLevels}
        type={2}
        onSelect={ itemValue => {
          this.setState({ originLevelSelected: itemValue, originSubLevelSelected: null }, ()=> {
            this.getOriginSubLevels();
          });
        }} 
        selected={(originLevelSelected) ? originLevelSelected.nombre_nivel : null } />
    );
  }

  renderPicker6() {
    const { destinationLevels, destinationLevelSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Destino"
        items={destinationLevels}
        type={2}
        onSelect={ itemValue => {
          this.setState({ destinationLevelSelected: itemValue, destinationSubLevelSelected: null }, ()=> {
            this.getDestinationSubLevels();
          });
        }} 
        selected={(destinationLevelSelected) ? destinationLevelSelected.nombre_nivel : null } />
    );
  }

  renderPicker7() {
    const { originSubLevels, originSubLevelSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Origen"
        items={originSubLevels}
        type={3}
        onSelect={ itemValue => {
          this.setState({ originSubLevelSelected: itemValue });
        }} 
        selected={(originSubLevelSelected) ? originSubLevelSelected.nombre_subnivel : null } />
    );
  }

  renderPicker8() {
    const { destinationSubLevels, destinationSubLevelSelected } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Destino"
        items={destinationSubLevels}
        type={3}
        onSelect={ itemValue => {
          this.setState({ destinationSubLevelSelected: itemValue });
        }} 
        selected={(destinationSubLevelSelected) ? destinationSubLevelSelected.nombre_subnivel : null } />
    );
  }

  goToShowScreen() {
    const { navigation } = this.props;
    const { user, specieOriginSelected, specieDestinationSelected, originZoneSelected, destinationZoneSelected, originLevelSelected, destinationLevelSelected, originSubLevelSelected, destinationSubLevelSelected } = this.state;
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
    if ( !originSubLevelSelected ) {
      errors.push('- Subnivel de Origen');
    } else {
      values.push('Subnivel de Origen : ' + originSubLevelSelected.nombre_subnivel);
    }
    if ( !destinationSubLevelSelected ) {
      errors.push('- Subnivel de Destino');
    } else {
      values.push('Subnivel de Destino : ' + destinationSubLevelSelected.nombre_subnivel);
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
          SQLiteHelper.setTracking(user.id_usuario, specieOriginSelected.id_especie, originZoneSelected.id_zona, originLevelSelected.id_nivel, originSubLevelSelected.id_subnivel, specieDestinationSelected.id_especie, destinationZoneSelected.id_zona, destinationLevelSelected.id_nivel, destinationSubLevelSelected.id_subnivel, user.id_tipousuario)
          .then((result) => {
            console.log('Tracking ok + '+result);
            SQLiteHelper.calculate(specieOriginSelected.id_especie, specieDestinationSelected.id_especie, originLevelSelected.id_nivel, destinationLevelSelected.id_nivel, user.id_tipousuario, originZoneSelected.id_zona, destinationZoneSelected.id_zona)
            .then((items) => {
              console.log('results : '+JSON.stringify(items));
              if (items.length > 0) {
                navigation.navigate('ShowScreen', {origin: specieOriginSelected.nombre,destination: specieDestinationSelected.nombre,results: items});
              }
            })
            .catch(console.log);
          })
          .catch(console.log);
        }},
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#EAEAEA'}}>
      <ScrollView style={{flex: 1, backgroundColor: '#EAEAEA'}}>

      <View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10}}>
        <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}}>Selecciona Especie</Text>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 5}}>
            {this.renderPicker1()}
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            {this.renderPicker2()}
          </View>
        </View>
      </View>
      <View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10}}>
        <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}}>Selecciona Zona</Text>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 5}}>
            {this.renderPicker3()}
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            {this.renderPicker4()}
          </View>
        </View>
      </View>
      <View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10}}>
        <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}}>Selecciona Nivel</Text>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 5}}>
            {this.renderPicker5()}
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            {this.renderPicker6()}
          </View>
        </View>
      </View>
      <View style={{flex: 1, paddingVertical: 20, paddingHorizontal: 10}}>
        <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20, color: 'black'}}>Selecciona Subnivel</Text>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, marginRight: 5}}>
            {this.renderPicker7()}
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            {this.renderPicker8()}
          </View>
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