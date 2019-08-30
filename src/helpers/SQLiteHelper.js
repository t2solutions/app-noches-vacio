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
  setTracking(id_usuario, id_especie_or, id_zona_or, id_nivel_or, id_subnivel_or, id_especie_des, id_zona_des, id_nivel_des, id_subnivel_des, id_tipo_usuario) {
    return SQLiteHelper.executeQuery(
      `insert into trazabilidad ( id_usuario, id_especie_or, id_zona_or, id_nivel_or, id_subnivel_or, id_especie_des, id_zona_des, id_nivel_des, id_subnivel_des, id_tipo_usuario, fecha) 
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'));`, 
      [id_usuario, id_especie_or, id_zona_or, id_nivel_or, id_subnivel_or, id_especie_des, id_zona_des, id_nivel_des, id_subnivel_des, id_tipo_usuario])
  }

}

export { SQLiteHelper };