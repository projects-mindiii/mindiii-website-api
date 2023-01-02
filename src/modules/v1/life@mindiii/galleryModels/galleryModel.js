import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";

const knex = knexJs(knexConfig),
    baseModelObj = new BaseModel();

export default class galleryModel extends BaseModel {

    /**
     * Gallery list 
     * 
     * @param {*} query 
     * @param {*} opts 
     * @param {*} tableName 
     * @returns 
     */
    fetchGalleryListWithSelectedFields(query = {}, opts = [], tableName = this.table,) {
        var q = knex(tableName)
            .select(opts)
            .where(query)
        return q.then((res) => {

            return res;
        })
    }
}