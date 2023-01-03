import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();


export default class portfolioModel extends BaseModel {


    /**
     * Portfolio list 
     * 
     * @param {*} query 
     * @param {*} opts 
     * @param {*} tableName 
     * @returns 
     */
    fetchPortfolioListWithSelectedFields(query = {}, opts = [], tableName = this.table,) {
        var q = knex(tableName)
            .select(opts)
            .where(query)
            .where({ "categories.status": 1 })
            .where({ "categories.is_delete": 0 })
            .innerJoin("categories", "categories.id", "portfolio.industries_id")
        //inner jon and status and delete check
        return q.then((res) => {

            return res;
        })
    }

    /**
     * Portfolio product detail 
     * 
     * @param {*} query 
     * @param {*} opts 
     * @param {*} tableName 
     * @returns 
     */
    fetchProductDataWithSelectedFields(query = {}, opts = [], tableName = this.table,) {
        return knex(tableName)
            .select(opts)
            .where(query)
            .leftJoin("categories", "categories.id", "portfolio.industries_id")
            .first()
    }
}