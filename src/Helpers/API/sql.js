import { SQLite } from 'expo';

const db = SQLite.openDatabase("database.db");

export default class SQL {
    /**
     * @param {String} name
     * @param {String} query 
     */
    createTable(name, query) {
        return db.transaction(tx => {
            console.log(`CREATE TABLE IF NOT EXISTS ${name} (${query})`);
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${name} (${query})`);
          });
    }

    /**
     *
     * @param {String} query
     */
    query(query) {
        return db.transaction(tx => {
            tx.executeSql(query);
          });    
    }

    /**
     * @param {Function} transaction
     */
    transaction(transaction) {
        return db.transaction(transaction);
    }

    async select(tableName, filter) {
        if(filter === undefined || filter === null) {
            filter = "*";
        }else if(Array.isArray(filter)) {
            filter = filter.join(',');
        }

        return new Promise(await function (resolve, reject)  {
            db.transaction(
                tx => {
                  tx.executeSql(`select ${filter} from ${tableName}`, [], (_, { rows }) => {
                      //console.log("sql class: " + JSON.stringify(rows));
                      return resolve(JSON.stringify(rows));
                  }
                  );
                }
              );

              return reject();
        })

    }

    insert(tableName, column) {

        var size = 0;

        for(let item in column) {
            if (column.hasOwnProperty(item)) size++;
        }

        var columnName = "";
        var data = "";

        let count = 0;

        for(let item in column) {
            count++;
            if(count === size) {
                columnName += item;
                data += `'${column[item]}'`
            }else {
                data += `'${column[item]}',`
                columnName += item + ',';
            }
        }

        //console.log(`INSERT INTO ${tableName}(${columnName}) VALUES(${data})`)

        return this.query(`INSERT INTO ${tableName}(${columnName}) VALUES(${data})`);
    }
    update(tableName, column, filter) {

        var size = 0;
        var sizeFilter = 0;
        let count = 0;
        let countFilter = 0;
        let filters = "";
        let setters = "";


        for(let item in column) {
            if (column.hasOwnProperty(item)) size++;
        }

        for(let item in column) {
            count++;
            if(count === size) {
                setters += item+"='"+column[item]+"'";
                
            }else {
                setters += item+"='"+column[item]+"',"
            }
        }

        for(let item in filter)
        {
            if (filter.hasOwnProperty(item)) sizeFilter++;
        }

        for(let item in filter) {
            countFilter++;
            if(countFilter === sizeFilter) {
                filters += item+"='"+filter[item]+"'";
            }else {
                filters += item+"='"+filter[item] + "' AND ";
            }
        }
        //console.log(`UPDATE ${tableName} SET ${setters} WHERE ${filters}`)

        return this.query(`UPDATE ${tableName} SET ${setters} WHERE ${filters}`); 
    }
    delete(tableName, filter) {

        var sizeFilter = 0;
        let countFilter = 0;
        let filters = "";

        for(let item in filter)
        {
            if (filter.hasOwnProperty(item)) sizeFilter++;
        }

        for(let item in filter) {
            countFilter++;
            if(countFilter === sizeFilter) {
                filters += item+'='+filter[item];
            }else {
                filters += item+'='+filter[item] + ' AND ';
            }
        }
        //console.log(`DELETE FROM ${tableName} WHERE ${filters}`);

        return this.query(`DELETE FROM ${tableName} WHERE ${filters}`); 

    }
}