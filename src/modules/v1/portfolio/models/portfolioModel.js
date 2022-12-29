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
            .select(knex.raw(`GROUP_CONCAT(portfolio.id SEPARATOR ',') as product_id`))
            .groupBy('portfolio.industries_id')
            .leftJoin("categories", "categories.id", "portfolio.industries_id")
        return q.then((res) => {

            return res;
        })
    }

    fetchPortfolioListDataWithSelectedFields(query = {}, tableName = this.table,) {
        return knex(tableName)
            .select('portfolio.name as product_name')
            .where(query)
            .first()

    }
}