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

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user'); 
    this.setState({user: user});
    //console.log('paso user -> '+JSON.stringify(user));
    await this.getSpecies(user);
  }

  async getSpecies(usr) {

    //console.log('user ->'+JSON.stringify(usr));

    if (usr.usar_remoto == true) {

			const responseSpecies = await fetch("http://antu.t2solutions.cl/combos/especie", {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': usr.jwt
				})
      });
      
      var responseSpeciesFinal = await responseSpecies.json();
      console.log("responseSpecies-> "+JSON.stringify(responseSpeciesFinal));
      if (responseSpecies.status == 200) {
        //Colar respuesta -> (id_especie, nombre)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({species: responseSpeciesFinal.data}) ; 
      }
 
    } else {
      var lstEspecies = await SQLiteHelper.getArray("select * from especie", []);
      this.setState({species: lstEspecies}) ; 

      //SQLiteHelper.getArray("select * from especie", [])
      //.then(items => { this.setState({species: items}) })
      //.catch(console.log) 
    }

  }

   async getOriginZones(id_specie, usr) {

    console.log('getOriginZones user ->'+usr);

    if (usr.usar_remoto == true) {
      console.log('Se procede a usar remoto');

      const responseZones = await fetch("http://antu.t2solutions.cl/combos/zona/"+id_specie, {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': usr.jwt
				})
      }); 

      var responseZonesFinal = await responseZones.json();
      console.log("responseSpecies-> "+JSON.stringify(responseZonesFinal));
      if (responseZones.status == 200) {
        //Colar respuesta -> (id_zona, descripcion, id_especie)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({originZones: responseZonesFinal.data}) ; 
      }    


    } else {

      // id_specie = 1; //TODO: Remove when database it's complete

      var lstZonas = await SQLiteHelper.getArray("select * from zona where id_especie=?", [id_specie]);
      this.setState({originZones: lstZonas}) ; 
     
      // SQLiteHelper.getArray("select * from zona where id_especie=?", [id_specie])
      // .then(items => { this.setState({originZones: items}) })
      // .catch(console.log)
   }

  }

  async getDestinationZones(id_specie, user) {

    console.log('getDestinationZones user ->'+user);

    if (user.usar_remoto == true) {
      console.log('Se procede a usar remoto');

      const responseZones = await fetch("http://antu.t2solutions.cl/combos/zona/"+id_specie, {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': user.jwt
				})
      }); 

      var responseZonesFinal = await responseZones.json();
      console.log("responseSpecies-> "+JSON.stringify(responseZonesFinal));
      if (responseZones.status == 200) {
        //Colar respuesta -> (id_zona, descripcion, id_especie)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({destinationZones: responseZonesFinal.data}) ; 
      }      


    } else {  
      //id_specie = 1; //TODO: Remove when database it's complete

      var lstZonas = await SQLiteHelper.getArray("select * from zona where id_especie=?", [id_specie]);
      this.setState({destinationZones: lstZonas}) ; 

      // SQLiteHelper.getArray("select * from zona where id_especie=?", [id_specie])
      // .then(items => { this.setState({destinationZones: items}) })
      // .catch(console.log)   
    }
  }

  async getOriginLevels(id_specie, user, id_zona) {

    // const { originZoneSelected } = this.state;
    // if (!originZoneSelected) {
    //   console.log('originZoneSelected ->'+originZoneSelected);
    //   return
    // }   

    console.log('id_zona pasado -> '+id_zona);
    console.log('getOriginLevels user ->'+user);

    if (user.usar_remoto == true) {
      console.log('Se procede a usar remoto');

      //TODO: Enviar ademas el id de la zona (id_zona) al backend
      const responseLevels = await fetch("http://antu.t2solutions.cl/combos/nivel/"+id_specie+"/"+id_zona, {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': user.jwt
				})
      });   
      
      var responseLevelsFinal = await responseLevels.json();
      console.log("responseLevels-> "+JSON.stringify(responseLevelsFinal));
      if (responseLevels.status == 200) {
        //Colar respuesta -> (id_zona, descripcion, id_especie)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({originLevels: responseLevelsFinal.data}) ; 
      }  
 

    } else {
      //Cambio ASL y TTH
      var lstNiveles = await SQLiteHelper.getArray("select * from nivel n join nivel_zona nz on (nz.id_nivel = n.id_nivel) join zona z on (z.id_zona=nz.id_zona) where z.id_especie=? and nz.id_zona=?", [id_specie, id_zona]);
      //var lstNiveles = await SQLiteHelper.getArray("select * from nivel where id_especie=?", [id_specie]);
      this.setState({originLevels: lstNiveles}) ; 

      //select * from nivel n join nivel_zona nz on (nz.id_nivel = n.id_nivel) join zona z on (z.id_zona=nz.id_zona) where n.id_nivel=1 and z.id_especie=1;

      // SQLiteHelper.getArray("select * from nivel where id_especie=?", [id_specie])
      // .then(items => { this.setState({originLevels: items}) })
      // .catch(console.log)
    }

  }

  async getDestinationLevels(id_specie, user, id_zona) {

    // const { destinationZoneSelected } = this.state;
    // if (!destinationZoneSelected) {
    //   return
    // } 

    console.log('getDestinationLevels user ->'+user);

    if (user.usar_remoto == true) {
      console.log('Se procede a usar remoto');

      //TODO - Pasar al backend el id_zona
      const responseLevels = await fetch("http://antu.t2solutions.cl/combos/nivel/"+id_specie+"/"+id_zona, {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': user.jwt
				})
      });   
      
      var responseLevelsFinal = await responseLevels.json();
      console.log("responseLevels-> "+JSON.stringify(responseLevelsFinal));
      if (responseLevels.status == 200) {
        //Colar respuesta -> (id_zona, descripcion, id_especie)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({destinationLevels: responseLevelsFinal.data}) ; 
      }  


    } else {
      //Cambio ASL y TTH
      var lstNiveles = await SQLiteHelper.getArray("select * from nivel n join nivel_zona nz on (nz.id_nivel = n.id_nivel) join zona z on (z.id_zona=nz.id_zona) where z.id_especie=? and nz.id_zona=?", [id_specie, id_zona]);
      //var lstNiveles = await SQLiteHelper.getArray("select * from nivel where id_especie=?", [id_specie]);
      this.setState({destinationLevels: lstNiveles}) ; 

      // SQLiteHelper.getArray("select * from nivel where id_especie=?", [id_specie])
      // .then(items => { this.setState({destinationLevels: items}) })
      // .catch(console.log)
    }
  }

  async getOriginSubLevels(user) {
    const { originZoneSelected, originLevelSelected, specieOriginSelected } = this.state;
    if (!originZoneSelected || !originLevelSelected || !specieOriginSelected) {
      return
    }

    console.log('getOriginSubLevels user ->'+user);
    console.log('originLevelSelected selectred -> '+originLevelSelected.id_nivel);
    console.log('specieOriginSelected selected -> '+specieOriginSelected.id_especie);

    if (user.usar_remoto == true) {
      console.log('Se procede a usar remoto');

      const responseSubLevels = await fetch("http://antu.t2solutions.cl/combos/subnivel/"+originLevelSelected.id_nivel+"/"+originZoneSelected.id_especieid_especie+"/"+specieOriginSelected.id_zona, {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': user.jwt
				})
      });   
      
      var responseSubLevelsFinal = await responseSubLevels.json();
      console.log("responseSubLevels Origin -> "+JSON.stringify(responseSubLevelsFinal));
      if (responseSubLevels.status == 200) {
        //Colar respuesta -> (id_zona, descripcion, id_especie)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({originSubLevels: responseSubLevelsFinal.data}) ; 
      }  

    } else {
      //TTH - Cambio en consulta
      var lstNiveles = await SQLiteHelper.getArray("select * from subnivel sn join zona z on(sn.id_zona=z.id_zona and z.id_especie=?) where sn.id_zona=? and sn.id_nivel=?", [specieOriginSelected.id_especie, originZoneSelected.id_zona , originLevelSelected.id_nivel]); 
      //var lstNiveles = await SQLiteHelper.getArray("select * from subnivel where id_zona=? and id_nivel=?", [originZoneSelected.id_zona , originLevelSelected.id_nivel]);
      this.setState({originSubLevels: lstNiveles}) ; 

      // SQLiteHelper.getArray("select * from subnivel where id_zona=? and id_nivel=?", [originZoneSelected.id_zona , originLevelSelected.id_nivel])
      // .then(items => { this.setState({originSubLevels: items}) })
      // .catch(console.log)
    }
  }

  async getDestinationSubLevels(user) {
    const { destinationZoneSelected, destinationLevelSelected, specieDestinationSelected } = this.state;
    if (!destinationZoneSelected || !destinationLevelSelected || !specieDestinationSelected) {
      return
    }

    console.log('getDestinationSubLevels user ->'+user);
    console.log('destinationLevelSelected selectred -> '+destinationLevelSelected.id_nivel);
    console.log('specieDestinationSelected selected -> '+specieDestinationSelected.id_especie);
    console.log('destinationZoneSelected selected -> '+destinationZoneSelected.id_zona);

    if (user.usar_remoto == true) {
      console.log('Se procede a usar remoto');

      const responseSubLevels = await fetch("http://antu.t2solutions.cl/combos/subnivel/"+destinationLevelSelected.id_nivel+"/"+destinationZoneSelected.id_especie+"/"+specieDestinationSelected.id_zona, {
				method: 'GET',
				headers: new Headers({
          'Content-Type': 'application/json',
          'token': user.jwt
				})
      });   
      
      var responseSubLevelsFinal = await responseSubLevels.json();
      console.log("responseSubLevels Destination -> "+JSON.stringify(responseSubLevelsFinal));
      if (responseSubLevels.status == 200) {
        //Colar respuesta -> (id_zona, descripcion, id_especie)
        //console.log(JSON.stringify(responseSpecies.data));
        this.setState({destinationSubLevels: responseSubLevelsFinal.data}) ; 
      } 

      
    } else {
      //TTH Cambio en consulta
      var lstNiveles = await SQLiteHelper.getArray("select * from subnivel sn join zona z on(sn.id_zona=z.id_zona and z.id_especie=?) where sn.id_zona=? and sn.id_nivel=?", [specieDestinationSelected.id_especie, destinationZoneSelected.id_zona , destinationLevelSelected.id_nivel]); 
      //var lstNiveles = await SQLiteHelper.getArray("select * from subnivel where id_zona=? and id_nivel=?", [destinationZoneSelected.id_zona , destinationLevelSelected.id_nivel]);
      this.setState({destinationSubLevels: lstNiveles}) ; 

      // SQLiteHelper.getArray("select * from subnivel where id_zona=? and id_nivel=?", [destinationZoneSelected.id_zona , destinationLevelSelected.id_nivel])
      // .then(items => { this.setState({destinationSubLevels: items}) })
      // .catch(console.log)
    }

  }

  renderPicker1() {

    //const { navigation } = this.props;
    const { species, specieOriginSelected, user } = this.state;
    console.log('se conoce user ->'+JSON.stringify(user));
    //console.log('user.jwt ->'+user.jwt);
    //console.log('se conoce param user -> '+navigation.getParam('user'));

    return (
      
      <NVInputDropdown 
        placeholder="Especie Origen"
        items={species}
        type={0}
        onSelect={ itemValue => {
          this.setState({ specieOriginSelected: itemValue, originZoneSelected: null, originLevelSelected: null, originLevelSubSelected: null, originSubLevels: [] });
          this.getOriginZones(itemValue.id_especie, user);
          //this.getOriginLevels(itemValue.id_especie, user);
        }} 
        selected={(specieOriginSelected) ? specieOriginSelected.nombre : null } />
    );
  }

  renderPicker2() {
    const { species, specieDestinationSelected, user } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Especie Destino"
        items={species}
        type={0}
        onSelect={ itemValue => {
          this.setState({ specieDestinationSelected: itemValue, destinationZoneSelected: null, destinationLevelSelected: null, destinationSubLevelSelected: null, destinationSubLevels: [] });
          this.getDestinationZones(itemValue.id_especie, user);
          //this.getDestinationLevels(itemValue.id_especie, user);
        }} 
        selected={(specieDestinationSelected) ? specieDestinationSelected.nombre : null } />
    );
  }

  renderPicker3() {
    const { specieOriginSelected, originZones, originZoneSelected, user } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Zona Origen"
        items={originZones}
        type={1}
        onSelect={ itemValue => {
          this.setState({ originZoneSelected: itemValue });
          this.getOriginLevels(specieOriginSelected.id_especie, user, itemValue.id_zona);
          //this.getOriginSubLevels(user);
        }} 
        selected={(originZoneSelected) ? originZoneSelected.descripcion : null } />
    );
  }

  renderPicker4() {
    const { specieDestinationSelected, destinationZones, destinationZoneSelected, user } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Zona Destino"
        items={destinationZones}
        type={1}
        onSelect={ itemValue => {
          this.setState({ destinationZoneSelected: itemValue });
          this.getDestinationLevels(specieDestinationSelected.id_especie, user, itemValue.id_zona);
          //this.getDestinationSubLevels(user);
        }} 
        selected={(destinationZoneSelected) ? destinationZoneSelected.descripcion : null } />
    );
  }

  renderPicker5() {
    const { originLevels, originLevelSelected, user } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Nivel Origen"
        items={originLevels}
        type={2}
        onSelect={ itemValue => {
          this.setState({ originLevelSelected: itemValue, originSubLevelSelected: null }, ()=> {
            this.getOriginSubLevels(user);
          });
        }} 
        selected={(originLevelSelected) ? originLevelSelected.nombre_nivel : null } />
    );
  }

  renderPicker6() {
    const { destinationLevels, destinationLevelSelected, user } = this.state;
    return (
      <NVInputDropdown 
        placeholder="Nivel Destino"
        items={destinationLevels}
        type={2}
        onSelect={ itemValue => {
          this.setState({ destinationLevelSelected: itemValue, destinationSubLevelSelected: null }, ()=> {
            this.getDestinationSubLevels(user);
          });
        }} 
        selected={(destinationLevelSelected) ? destinationLevelSelected.nombre_nivel : null } />
    );
  }

  renderPicker7() {
    const { originSubLevels, originSubLevelSelected, user } = this.state;
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
    const { destinationSubLevels, destinationSubLevelSelected, user } = this.state;
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
        {text: 'Continuar', onPress: async() => {

          console.log('user se conoce como: ->'+JSON.stringify(user));
          console.log('aplica online al presionar continuar -> '+user.usar_remoto);
          console.log('user.id_tipo_usuario como id_tipousuario -> '+user.id_tipousuario);
          console.log('user.id_tipo_usuario como id_tipo_usuario -> '+user.id_tipo_usuario);

          var result = await SQLiteHelper.setTracking(user.id_usuario, specieOriginSelected.id_especie, originZoneSelected.id_zona, originLevelSelected.id_nivel, originSubLevelSelected.id_subnivel, specieDestinationSelected.id_especie, destinationZoneSelected.id_zona, destinationLevelSelected.id_nivel, destinationSubLevelSelected.id_subnivel, user.id_tipousuario);
          console.log('aplica online -> '+user.usar_remoto);
          console.log('Tracking ok + '+result);
 
          if (user.usar_remoto==true) {

            var jsonIdaCalculoRemoto = {
                                        'idTipoUsuario': user.id_tipousuario,
                                        'idUsuario': user.id_usuario, 
                                        'idRol': user.id_rol, 
                                        'idEspecieOrigen': specieOriginSelected.id_especie, 
                                        'idZonaOrigen': originZoneSelected.id_zona,  
                                        //Comentario ASL: El id_nivel no va en esto, va el cod_nivel
                                        'idNivelOrigen': originLevelSelected.id_nivel, 
                                        'idSubnivelOrigen' : originSubLevelSelected.id_subnivel,
                                        'idEspecieDestino': specieDestinationSelected.id_especie, 
                                        'idZonaDestino': destinationZoneSelected.id_zona, 
                                        //Comentario ASL: El id_nivel no va en esto, va el cod_nivel
                                        'idNivelDestino': destinationLevelSelected.id_nivel, 
                                        'idSubnivelDestino': destinationSubLevelSelected.id_subnivel  
            }
            
            //TODO Verificar invocacion a la operacion remota POST /calculo/grid
            var responseRemoteCalc = await fetch("http://antu.t2solutions.cl/calculo/grid", {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'token': user.jwt
              }),
              body: JSON.stringify(jsonIdaCalculoRemoto)               
            });   
            
            var responseRemoteCalcFinal = await responseRemoteCalc.json();
            console.log("responseRemoteCalc -> "+JSON.stringify(responseRemoteCalcFinal));
            if (responseRemoteCalc.status == 200) {
              if (responseRemoteCalcFinal.length > 0) {
                navigation.navigate('ShowScreen', {origin: specieOriginSelected.nombre,destination: specieDestinationSelected.nombre,results: responseRemoteCalcFinal.data});
              } else {
                Alert.alert('No se encontraron datos para la pirámide seleccionada');
                return;
              }
            } 

          } else {
            console.log('destinationLevelSelected.id_nivel -> '+destinationLevelSelected.id_nivel);
            console.log('originLevelSelected.id_nivel -> '+originLevelSelected.id_nivel);
            console.log('destinationLevelSelected.cod_nivel -> '+destinationLevelSelected.cod_nivel);
            console.log('originLevelSelected.cod_nivel -> '+originLevelSelected.cod_nivel);

            var items = await SQLiteHelper.calculate(specieOriginSelected.id_especie, specieDestinationSelected.id_especie, originLevelSelected.id_nivel, destinationLevelSelected.id_nivel, user.id_rol, originZoneSelected.id_zona, destinationZoneSelected.id_zona);
            console.log('results : '+JSON.stringify(items));
            if (items.length > 0) {
              navigation.navigate('ShowScreen', {origin: specieOriginSelected.nombre,destination: specieDestinationSelected.nombre,results: items});
            } else {
              Alert.alert('No se encontraron datos para la pirámide seleccionada');
              return;
            }
          }
        }
      },
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
            {this.renderPicker1(this.user)}
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