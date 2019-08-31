import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView, Image } from 'react-native';

export default class ShowScreen extends Component {

  static navigationOptions = {
    title: 'Resultado',
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
      origin: '',
      destination: '',
      results: []
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const origin = navigation.getParam('origin');
    const destination = navigation.getParam('destination');
    const results = navigation.getParam('results');
    this.setState({origin: origin, destination: destination, results: results});
  }

  renderIcon(name, state) {
    switch ( state ) {
      case 0:
        if (name.toLowerCase() == "cerdos") {
          return (
            <Image style={{width: 50, height: 38}} resizeMode={'contain'} source={require('../../assets/Pig_Small_OK.png')}/>
          )
        } else if (name.toLowerCase() == "pollos") {
          return (
            <Image style={{width: 50, height: 38}} resizeMode={'contain'} source={require('../../assets/Pollo_Small_OK.png')}/>
          )
        } else if (name.toLowerCase() == "pavos") {
          return (
            <Image style={{width: 50, height: 38}} resizeMode={'contain'} source={require('../../assets/Pavo_Small_OK.png')}/>
          )
        }
      default:
        if (name.toLowerCase() == "cerdos") {
          return (
            <Image style={{width: 50, height: 38}} resizeMode={'contain'} source={require('../../assets/Pig_Small_BAD.png')}/>
          )
        } else if (name.toLowerCase() == "pollos") {
          return (
            <Image style={{width: 50, height: 38}} resizeMode={'contain'} source={require('../../assets/Pollo_Small_BAD.png')}/>
          )
        } else if (name.toLowerCase() == "pavos") {
          return (
            <Image style={{width: 50, height: 38}} resizeMode={'contain'} source={require('../../assets/Pavo_Small_BAD.png')}/>
          )
        }
      }
  }

  renderStateLabel(state) {
    switch ( state ) {
      case 0:
        return (
          <View style={{padding: 8, borderRadius: 6, backgroundColor: 'green'}}>
            <Text style={{color: 'white', fontSize: 10}}>PERMITIDO</Text>
          </View>
        )
      default:
        return (
          <View style={{padding: 8, borderRadius: 6, backgroundColor: '#E00734'}}>
            <Text style={{color: 'white', fontSize: 10}}>DENEGADO</Text>
          </View>
        )
      }
  }

  renderItem(item) {
    return(
      <View style={{flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 10, marginBottom: 10}} >
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{alignItems: 'center', marginRight: 20, justifyContent: 'center'}}>
            {this.renderIcon(item.nombre, item.valor)}
            {this.renderStateLabel(item.valor)}
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: '#FF6F0D', fontSize: 12, fontWeight: '100'}}>Planta</Text>
            <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', marginTop: 4}}>{item.nombre}</Text>
            <Text style={{color: '#FF6F0D', fontSize: 12, fontWeight: '100', marginTop: 8}}>Nivel</Text>
            <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', marginTop: 4}}>{item.nombre_nivel}</Text>
            <Text style={{color: '#FF6F0D', fontSize: 12, fontWeight: '100', marginTop: 8}}>Noches de Vacío</Text>
            <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', marginTop: 4}}> {item.valor}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderList() {
    const { results } = this.state;
    return (
      <FlatList
        contentContainerStyle={{paddingBottom:10}}
        style={{flex: 1}}
        data={results}
        keyExtractor={(item, index) => String(index)}
        renderItem={({item}) => this.renderItem(item) } />
    );
  }
 
  render() {
    const { origin, destination } = this.state;
    const date = new Date();
    const formatted_date = date.getDate()+ "/" +(((date.getMonth() + 1) <= 9 ) ? "0"+(date.getMonth() + 1) : (date.getMonth() + 1)) + "/" + date.getFullYear();
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#EAEAEA', padding: 10}}>
        <Text style={{color: 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>Desde planta {origin} al {formatted_date}{'\n'}Destino planta {destination} al {formatted_date}</Text>
        {this.renderList()}
      </ScrollView>
    )
  }
}

