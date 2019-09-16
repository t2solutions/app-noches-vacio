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
import { NVLoader2 } from '../modules';
import  decode  from 'jwt-decode';
import moment from 'moment';
import { resolveUri } from 'expo-asset/build/AssetSources';
const jwtKey = 'secret'

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
	  		loading: false,
	  		transitionMessage: ''
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
	  
	//   if ( !localDatabase.exists ) {

        FileSystem.downloadAsync(
          Asset.fromModule(require('../../assets/www/'+databaseName)).uri,
          `${FileSystem.documentDirectory}SQLite/${databaseName}`
        ).then(({ uri }) => {
          console.log('✅ Database copy to : ' + uri);
        })
        .catch(error => {
          console.log('❗️ Database copy error : ' + error);
		})
		
    //   } else {
    //     console.log('✅ Database exist');
	//   }
	  
    } catch (error) {
      console.log('❗️ Error : ' + error);
    }
  }

  	async obtieneUltimaSincro(idUsuario) { 
		console.log('obtieneUltimaSincro idUsuario='+idUsuario);
		var lastSyncDate = await SQLiteHelper.getLastSyncDate(idUsuario);
		return lastSyncDate.valor;
	}

	login2 = async() => {
		const { navigation } = this.props;
		const {Rut, Password} = this.state;

		if(Rut=='') {
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

		this.setState({loading: true, transitionMessage: 'Iniciando sesión'});

		var response;
		try {

			const response = await fetch("http://antu.t2solutions.cl/login", {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
				body: JSON.stringify({
					username: Rut,
					password: Password
				 }) 
			});

			console.log('Respuesta desde API en codigo pre eval ok: '+response.status); //statusText
			console.log('response.ok? -> '+response.ok);

			if (response.ok) {

				if (response.status != 401) {
					var responseJson = await response.json();

					//alert(responseJson.token+' '+responseJson.status)
					var rawtoken = responseJson.token;
					//console.log('valor token crudo: '+rawtoken);
					var decoded = decode(rawtoken);
	
					let rmoteUser = {
									'id_usuario': decoded.idUsuario,
									'id_tipousuario': decoded.idTipoUsuario,
									'usar_remoto': true,
									'id_rol': decoded.idRol,
									'jwt': rawtoken 
									};
	
					console.log('tkn decodificado: '+JSON.stringify(decoded)+ ' usuario: '+decoded.usr+ ' ult fecha sincronizacion: '+decoded.ultFechaSincronizacion);	
					//Verificar respecto al last save (tabla parametros del userId)
					//Si supera 24 hrs (pronto parametrizable) al AAAA-MM-DD HH:MM:SS se debe solicitar sincronizar
					var remoteLastSyncDate = moment().format(decoded.ultFechaSincronizacion, 'YYYY-MM-DD hh:mm:ss', true);
					console.log('prueba obtenida remota y convertida a Moment '+remoteLastSyncDate);
						
					var lastDate = await SQLiteHelper.getLastSyncDate(decoded.idUsuario);
					var localLastSyncDate = moment().format(lastDate.valor, 'YYYY-MM-DD hh:mm:ss', true);
							
					var mLocalLastSyncDate = moment(localLastSyncDate); //.toDate()
					var mRemoteLastSyncDate = moment(remoteLastSyncDate); //.toDate()
					
					console.log('fecha obtenida y convertida a Moment desde BD '+localLastSyncDate);
					console.log('Moment hoy '+moment().format('YYYY-MM-DD hh:mm:ss'));
					console.log('mLocalLastSyncDate '+mLocalLastSyncDate + ' mRemoteLastSyncDate '+mRemoteLastSyncDate);
					
					var difDays = moment().diff(mRemoteLastSyncDate, 'days');
					if (difDays >= 1) {		
						console.log('DIF DIAS -> '+difDays  );
						this.setState({loading: true, transitionMessage: 'Ha pasado '+difDays+' dia(s) sin sincronizar la información... Sincronizando datos.'});
	
						var allData = await SQLiteHelper.getTracking(decoded.idUsuario);
	
						var pushData = {
							"id_usuario": decoded.idUsuario,
							"data": []
						};
	
						if (allData.length > 0) {		
							
							pushData = {
								"id_usuario": decoded.idUsuario,
								"data": allData
							};
	
							//console.log('results : '+JSON.stringify(allData));
							console.log(JSON.stringify(pushData));
	
						}
						this.setState({loading: false});
						//Le deberia pasar objeto user -> navigation.navigate('SearchScreen', { user: user });
						navigation.navigate('SearchScreen', { user: rmoteUser, id_usuario: decoded.idUsuario });
	
					} else {
						this.setState({loading: false, transitionMessage: 'Iniciando Sesión'});
						navigation.navigate('SearchScreen', { user: rmoteUser, id_usuario: decoded.idUsuario });								
					}
				} else {

				}
			} else if (response.status == 401) {
				console.log('Deberia entrar aqui -> '+response.status);				
				alert('Credenciales inválidas.');
				this.setState({loading: false});
			} else if (response.status == 502) {
				//PM2 desconectado
				throw new Error('Network request failed');
			}

		} catch (error) {
			console.log('Se procede a conexion local? '+error.message);
			if (error.message == 'Network request failed') {

				SQLiteHelper.auth(Rut, Password)
				.then( user => {

				setTimeout(function () {

				let rmoteUser = {
					'id_usuario': user.id_usuario,
					'id_tipousuario': user.id_tipousuario,
					'usar_remoto': false,
					'id_rol': user.id_rol,
					'jwt': '' 
					};

					this.setState({loading: false, transitionMessage: ''});
					navigation.navigate('SearchScreen', { user: rmoteUser });
				}.bind(this), 2500);
				})
				.catch( error => {
					this.setState({loading: false, transitionMessage: ''});
					Alert.alert(
						"",
						error,
						[{ text: "OK", onPress: () => {} }],
						{ cancelable: false }
					);
				})	
			} else {
				this.setState({loading: false});
				Alert.alert(
					"",
					error,
					[{ text: "OK", onPress: () => {} }],
					{ cancelable: false }
				);				
			}

		

		}




	}


	login = () => {
		const { navigation } = this.props;
		const {Rut, Password} = this.state;
		if(Rut=='') {
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

		this.setState({loading: true, transitionMessage: 'Iniciando sesión'});
		//Hacer login remoto
		fetch("http://antu.t2solutions.cl/login", {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({
				username: Rut,
				password: Password
			 }) 
		})

		.then(response => {
			console.log('Respuesta desde API en codigo pre eval ok: '+response.status); //statusText
			console.log('response.ok? -> '+response.ok);
			if (response.ok) {
				return response.json();
			} else {
				if(response.status != 401) { //statusText
					console.log('Respuesta desde API en codigo dentro de statusText: '+response.status);
					//Al no obtener conexion remota, se accede via BD local
					SQLiteHelper.auth(Rut, Password)
					.then( user => {
					setTimeout(function () {
						this.setState({loading: false, transitionMessage: ''});
						navigation.navigate('SearchScreen', { user: user });
					}.bind(this), 2500);
					})
					.catch( error => {
						this.setState({loading: false, transitionMessage: ''});
						Alert.alert(
							"",
							error,
							[{ text: "OK", onPress: () => {} }],
							{ cancelable: false }
						);
					})
				} else {
					console.log('Respuesta desde API en codigo dentro de cuando es 401: '+response.status);
					console.log(response.json());
					reject('Credenciales inválidas.')
					//throw new Error('Credenciales invalidas.');
				
					//alert('Credenciales inválidas.');
				}//return response.json(); //throw new Error(response.status);			
			}	
		})
		.then((responseJson) => {

			//alert(responseJson.token+' '+responseJson.status)
			var rawtoken = responseJson.token;
			//console.log('valor token crudo: '+rawtoken);
			var decoded = decode(rawtoken);
		
			let rmoteUser = {
							 'id_usuario': decoded.idUsuario,
							 'id_tipousuario': decoded.idTipoUsuario 
							};

			console.log('tkn decodificado: '+JSON.stringify(decoded)+ ' usuario: '+decoded.usr+ ' ult fecha sincronizacion: '+decoded.ultFechaSincronizacion);	
			//Verificar respecto al last save (tabla parametros del userId)
			//Si supera 24 hrs al AAAA-MM-DD HH:MM:SS se debe solicitar sincronizar
			var remoteLastSyncDate = moment().format(decoded.ultFechaSincronizacion, 'YYYY-MM-DD hh:mm:ss', true);
			console.log('prueba obtenida remota y convertida a Moment '+remoteLastSyncDate);
			
			//Se comenta por ahora
			//console.log('TEST retornando desde promise '+this.obtieneUltimaSincro(decoded.idUsuario).valor);

			   SQLiteHelper.getLastSyncDate(decoded.idUsuario)			
			   .then(lastDate => {			 	
					var localLastSyncDate = moment().format(lastDate.valor, 'YYYY-MM-DD hh:mm:ss', true);
					
					var mLocalLastSyncDate = moment(localLastSyncDate); //.toDate()
					var mRemoteLastSyncDate = moment(remoteLastSyncDate); //.toDate()
					
					console.log('fecha obtenida y convertida a Moment desde BD '+localLastSyncDate);
					console.log('Moment hoy '+moment().format('YYYY-MM-DD hh:mm:ss'));
					console.log('mLocalLastSyncDate '+mLocalLastSyncDate + ' mRemoteLastSyncDate '+mRemoteLastSyncDate);
					
					var difDays = moment().diff(mRemoteLastSyncDate, 'days');
					if (difDays >= 1) {		
						console.log('DIF DIAS -> '+difDays  );

						//this.setState({loading: true, transitionMessage: 'Ha pasado '+difDays+' dia(s) sin sincronizar la información... Sincronizando datos.'});
						
						SQLiteHelper.getTracking(decoded.idUsuario)
						.then(allData => {

							var pushData = {
								"id_usuario": decoded.idUsuario,
								"data": []
							};

						  if (allData.length > 0) {		
							  
							pushData = {
								"id_usuario": decoded.idUsuario,
								"data": allData
							};

							this.setState({loading: true, transitionMessage: 'Ha pasado '+difDays+' dia(s) sin sincronizar la información... Sincronizando datos.'});
							//console.log('results : '+JSON.stringify(allData));
							console.log(JSON.stringify(pushData));

						  }
						  this.setState({loading: false});
						  //Le deberia pasar objeto user -> navigation.navigate('SearchScreen', { user: user });
						  navigation.navigate('SearchScreen', { user: rmoteUser, id_usuario: decoded.idUsuario });
						})
						.catch(console.log);	

						//do stuff
						//this.setState({loading: true, transitionMessage: 'Iniciando Sesión 2'});
						//this.setState({loading: false});
						//navigation.navigate('SearchScreen', { user: decoded.usr, id_usuario: decoded.idUsuario });	


					} else {
						this.setState({loading: false, transitionMessage: 'Iniciando Sesión'});
						navigation.navigate('SearchScreen', { user: rmoteUser, id_usuario: decoded.idUsuario });								
					} 

				});
			

			//this.setState({loading: false});
			//navigation.navigate('SearchScreen', { user: decoded.usr, id_usuario: decoded.idUsuario });								
		
		
		})
		.catch((error) => {			
			console.error(error);
		});	
	}


  	render() {
	  const { loading } = this.state;
	  const { transitionMessage } = this.state; //'Iniciando sesión'; 
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
					onPress={() => this.login2()}
					style={styles.btn}>
					<Text style={styles.btnText}>Iniciar sesión</Text>
				</TouchableOpacity>
        </View>
        <NVLoader visible={loading} text={transitionMessage} />
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