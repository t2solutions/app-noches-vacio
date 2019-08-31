import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import { ToastAndroid, TextInput, Text, StyleSheet, Alert, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
const databaseName = "nochesvacio.db";
import { SQLiteHelper } from '../helpers/SQLiteHelper';
import { NVLoader } from '../modules';

export default class SignInScreen extends Component {

  static navigationOptions= ({navigation}) =>({
    headerStyle:{
      backgroundColor: 'transparent', 
      zIndex: 100,  
    },
    headerTransparent: true,
  });

  constructor(props) {
		super(props)
		this.state = {
			Rut:'',
			Password:'',
      showPass: true,
      loading: false
    }
  }

  async componentDidMount() {
    this.copyDatabase();
  }

	Valida_Rut( value ){
		var tmpstr = "";
		var intlargo = value
		if (intlargo.length> 0){
			crut = value
			largo = crut.length;
			if ( largo <2 ) {
				return false;
			}
			for ( i=0; i <crut.length ; i++ )
			if ( crut.charAt(i) != ' ' && crut.charAt(i) != '.' && crut.charAt(i) != '-' ){
				tmpstr = tmpstr + crut.charAt(i);
			}
			rut = tmpstr;
			crut=tmpstr;
			largo = crut.length;
	
			if ( largo> 2 )
				rut = crut.substring(0, largo - 1);
			else
				rut = crut.charAt(0);
	
			dv = crut.charAt(largo-1);
	
			if ( rut == null || dv == null )
			return 0;
	
			var dvr = '0';
			suma = 0;
			mul  = 2;
	
			for (i= rut.length-1 ; i>= 0; i--){
				suma = suma + rut.charAt(i) * mul;
				if (mul == 7)
					mul = 2;
				else
					mul++;
			}
	
			res = suma % 11;
			if (res==1)
				dvr = 'k';
			else if (res==0)
				dvr = '0';
			else{
				dvi = 11-res;
				dvr = dvi + "";
			}
	
			if ( dvr != dv.toLowerCase() ){
				return false;
			}
			//alert('El Rut Ingresado es Correcto!')
			return true;
		}
  }
  
  async copyDatabase() {
    try {
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, {
        intermediates: true
      });
      const localDatabase = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${databaseName}`);
      if ( !localDatabase.exists ) {
        FileSystem.downloadAsync(
          Asset.fromModule(require('../../assets/www/'+databaseName)).uri,
          `${FileSystem.documentDirectory}SQLite/${databaseName}`
        ).then(({ uri }) => {
          console.log('✅ Database copy to : ' + uri);
        })
        .catch(error => {
          console.log('❗️ Database copy error : ' + error);
        })
      } else {
        console.log('✅ Database exist');
      }
    } catch (error) {
      console.log('❗️ Error : ' + error);
    }
  }

	login = () => {
    const { navigation } = this.props;
    const {Rut, Password} = this.state;
		if(Rut==''){
      Alert.alert("","Por favor ingrese RUT");
			return
		}
		if(Password=='') {
      Alert.alert("","Por favor ingrese contraseña");
			return
		}
		if(!this.Valida_Rut(Rut)){
      Alert.alert("","Rut no válido");
			return
    }
    this.setState({loading: true});
    SQLiteHelper.auth(Rut, Password)
    .then( user => {
      setTimeout(function () {
        this.setState({loading: false});
        navigation.navigate('SearchScreen', { user: user });
      }.bind(this), 2500);
    })
    .catch( error => {
      this.setState({loading: false});
      Alert.alert(
        "",
        error,
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    })
	}
  	render() {
      const { loading } = this.state;
    	return (
			<KeyboardAwareScrollView style={styles.container} behavior="padding">
				<View style={{ flex:1, FlexDirection:'column', alignItems:'center', justifyContent: 'center', marginTop:100 }}>
				<View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
					<Ionicons
						name="ios-person"
						size={30}
						color="#053371"
						style={{ width: 30 }}
            		/>
					<TextInput
						placeholder="12345678-9"
						style={styles.input}
						onChangeText={Rut => this.setState({Rut})}
						autoCapitalize={'none'}
						returnKeyType={'done'}
						autoCorrect={false}
						placeholderTextColor="#000000"
						underlineColorAndroid="transparent"
						keyboardType="numbers-and-punctuation"
					/>
				</View>
				<View style={{flexDirection:'row'}}>
					<Ionicons
						name="ios-unlock"
						size={30}
						color="#053371"
						style={{ width: 30, marginTop:10, marginLeft:3 }}
            		/>
					<TextInput
						placeholder="Contraseña"
						style={styles.input}
						onChangeText={Password => this.setState({Password})}
						autoCapitalize={'none'}
						returnKeyType={'done'}
						autoCorrect={false}
						placeholderTextColor="#000000"
						underlineColorAndroid="transparent"
						secureTextEntry={this.state.showPass}
					/>
				</View>
				<TouchableOpacity
					onPress={() => this.login()}
					style={styles.btn}>
					<Text style={styles.btnText}>Iniciar sesión</Text>
				</TouchableOpacity>
        </View>
        <NVLoader visible={loading} text={'Iniciando Sesión'}/>
			</KeyboardAwareScrollView>
    	);
  	}
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

const styles = StyleSheet.create({
	container:{
		backgroundColor: 'transparent',
		width: DEVICE_WIDTH,
		height: DEVICE_HEIGHT,
  	},
  	picture: {
		alignItems: 'center',
		justifyContent: 'center',
		width: DEVICE_WIDTH,
		height: DEVICE_HEIGHT,
		resizeMode: 'cover',
  	},
  	btn:{
		alignItems: 'center',
		justifyContent: 'center',
        backgroundColor: '#053371',
		width: DEVICE_WIDTH - 180,
		height: 40,
    	borderRadius: 10,
		padding:10,
		margin:10,
	},
	btnText:{
		color: 'white',
		backgroundColor: 'transparent',
		fontWeight:'bold'
	},
	input: {
		textAlign: 'center',
		width: DEVICE_WIDTH - 100,
		height: 40,
		margin:5,
		backgroundColor: 'gray',
		// backgroundColor: 'rgba(255, 255, 255, 0.4)',
		borderRadius: 10,
		color: 'white',
		fontSize: 12,
	},
});