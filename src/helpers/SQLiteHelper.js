import { SQLite } from 'expo-sqlite';

const databaseName = "nochesvacio.db";
const db = SQLite.openDatabase(databaseName);
const logEnabled = true

const SQLiteHelper = {
  requestLog(query, args) {
    if ( logEnabled ) {
      console.log('🚀 SQLiteHelper');
      console.log('query : ' + query);
      console.log('args : ' + args);
    }
  },
  executeQuery(query, args) {
    this.requestLog(query, args)
    return new Promise( function( resolve, reject ) {
      db.transaction(tx => {
        tx.executeSql(
          query,
          args,
          (tx, results) => {
            resolve(results);
          },
          (tx, error) => {
            reject(error);
          }
        );
      }, error => {
        reject(error);
      })
    });
  },
  getArray(query, args) {
    this.requestLog(query, args)
    return new Promise( function( resolve, reject ) {
      db.transaction(tx => {
        tx.executeSql(query, args, (_, { rows : { _array } }) => {
          if (_array) {
            resolve(_array);
          } else {
            reject('error 1');
          }
        })
      }, error => {
        reject(error);
      })
    });
  },
  auth(user, password) {
    return SQLiteHelper.executeQuery("SELECT usuario.*,tipo_usuario.id_rol,tipo_usuario.descripcion AS descripcion_rol FROM usuario,tipo_usuario WHERE tipo_usuario.id_tipousuario = usuario.id_tipousuario AND rut=? AND pass=?", [user, password])
    //select * from usuario where rut=? and pass=?
    .then(SQLiteHelper.checkUser);
  },
  checkUser(object) {
    return new Promise(function(resolve, reject){
        if ( object.rows.length > 0 ) {
          resolve(object.rows.item(0))
        } else {
          reject('Credenciales inválidas.')
        }
     });
  },
  setTracking(id_usuario, id_especie_or, id_zona_or, id_nivel_or, id_subnivel_or, id_especie_des, id_zona_des, id_nivel_des, id_subnivel_des, id_tipo_usuario) {
    return SQLiteHelper.executeQuery(
      `insert into trazabilidad ( id_usuario, id_especie_or, id_zona_or, id_nivel_or, id_subnivel_or, id_especie_des, id_zona_des, id_nivel_des, id_subnivel_des, id_tipo_usuario, fecha) 
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'));`, 
      [id_usuario, id_especie_or, id_zona_or, id_nivel_or, id_subnivel_or, id_especie_des, id_zona_des, id_nivel_des, id_subnivel_des, id_tipo_usuario]);
  },
  calculate(id_especie_or, id_especie_des, id_nivel_or, id_nivel_des, id_rol, id_zona_or, id_zona_des) {
    return SQLiteHelper.getArray(
      `select e.nombre, n.nombre_nivel, pe.valor from piramide_especies pe join especie e on (e.id_especie=pe.especie_destino) join nivel n on (n.cod_nivel=pe.nivel_destino) 
      where pe.especie_origen=? and pe.especie_destino=? and pe.nivel_origen=? and pe.nivel_destino=? and pe.tipo_rol=? and pe.id_zona_origen=? and pe.id_zona_destino=?;`,
      [id_especie_or, id_especie_des, id_nivel_or, id_nivel_des, id_rol, id_zona_or, id_zona_des]);
  },
  getLastSyncDate(id_usuario) {
    return SQLiteHelper.executeQuery(`select valor from parametros where clave='lastsave';`)
    .then(SQLiteHelper.lastSyncDate);
  }, 
  lastSyncDate(object) {
    return new Promise(function(resolve, reject){
        if ( object.rows.length > 0 ) {
          resolve(object.rows.item(0))
        } else {
          resolve('')
        }
     });    
  },getTracking(id_usuario) {
    return SQLiteHelper.getArray("select * from trazabilidad where id_usuario=?;", [id_usuario]);
    //.then(SQLiteHelper.tracking);

  },tracking(object) {
      console.log('largo filas trazabilidad: '+object.rows.length);
      if ( object.rows.length > 0 ) {
      console.log('item 0 '+object.rows.item(0));
      //resolve(object.rows);
    }    
  }



}

export { SQLiteHelper };