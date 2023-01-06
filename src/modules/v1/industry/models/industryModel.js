import BaseModel from '~/models/BaseModel'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";

const knex = knexJs(knexConfig),
    baseModelObj = new BaseModel();

export default class industryModel extends BaseModel {

    /**
     * Industry list 
     * 
     * @param {*} query 
     * @param {*} opts 
     * @param {*} tableName 
     * @returns 
     */
    fetchindustryListWithSelectedFields(query = {}, opts = [], tableName = this.table,) {
        var q = knex(tableName)
            .select(opts)
            .where(query)
        return q.then((res) => {

            return res;
        })
    }
}