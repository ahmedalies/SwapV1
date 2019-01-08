import {injectable} from "inversify";
import {stringify} from "querystring";

@injectable()
export class MysqlHelper {
    public static getSelections(selections: string[]): Promise<string> {
        let query = "";
        if (selections.length > 0){
            let selectionCount = 0;
            query = query + "";
            selections.forEach((x) => {
                selectionCount++;
                if (selectionCount == selections.length){
                    query = query + x + "";
                } else {
                    query = query + x + ",";
                }
            })
        } else {
            query = "*"
        }

        return Promise.resolve(query);
    }

    public static getWhereClause(whereKeys:string[], whereValues: string[], noQoutes: number): Promise<string>{
        let query = "";
        if (whereKeys.length > 0) {
            if (whereKeys.length === whereValues.length){
                query = query + "where ";
                let valueCounter = 0;
                whereKeys.forEach((key) => {
                    if (noQoutes > 0 && valueCounter >= noQoutes)
                        query = query + key + "=" + whereValues[valueCounter];
                    else
                        query = query + key + "=" +  "'" + whereValues[valueCounter] + "'"; 
                        
                    valueCounter++;
                    if (valueCounter === whereKeys.length){

                    } else {
                        query = query + " and ";
                    }
                });
            } else {
                return Promise.reject('whereKeys != whereValues');
            }
        }

        return Promise.resolve(query);
    }

    public static getUpdateClause(updateKeys:string[], updateValues: string[]): Promise<string> {
        let query = "";
        if (updateKeys.length > 0) {
            if (updateKeys.length === updateValues.length){
                let valueCounter = 0;
                updateKeys.forEach((key) => {
                    query = query + key + "=" +  "'" + updateValues[valueCounter] + "'";
                    valueCounter++;
                    if (valueCounter === updateKeys.length){

                    } else {
                        query = query + ", ";
                    }
                });
            } else {
                return Promise.reject('updateKeys != updateValues');
            }
        }

        return Promise.resolve(query);
    }

    public static getInsertClause(insertKeys:string[], insertValues: string[]): Promise<string> {
        let query = "(";
        if (insertKeys.length > 0) {
            if (insertKeys.length === insertValues.length){
                let keyCounter = 0;
                insertKeys.forEach((key) => {
                    keyCounter++;
                    if (keyCounter === insertKeys.length){
                        query = query + key + ")";
                    } else {
                        query = query + key + ", ";
                    }
                });

                let valueCounter = 0;
                query = query + " values (";
                insertValues.forEach((key) => {
                    valueCounter++;
                    if (valueCounter === insertValues.length){
                        query = query + "\"" + key + "\")";
                    } else {
                        query = query + "\"" + key + "\"" + ",";
                    }
                });
            } else {
                return Promise.reject('insertKeys != insertValues');
            }
        }

        return Promise.resolve(query);
    }

    public static getInsertValues(insertValues: string[]): Promise<string> {
        let query = ", ";
        if (insertValues.length){
            let valueCounter = 0;
            query = query + " values (";
            insertValues.forEach((key) => {
                valueCounter++;
                if (valueCounter === insertValues.length){
                    query = query + "\"" + key + "\")";
                } else {
                    query = query + "\"" + key + "\"" + ",";
                }
            });
        } else {
            return Promise.reject('insertValues.length = 0');
        }

        return Promise.resolve(query);
    }
}