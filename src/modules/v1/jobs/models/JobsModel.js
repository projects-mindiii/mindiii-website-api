import BaseModel from '~/models/BaseModel'
import tableConstants from '~/constants/tableConstants'
import commonConstants from '~/constants/commonConstants'
import knexJs from "knex";
import knexConfig from "~/config/knexfile";
const knex = knexJs(knexConfig);
const baseModelObj = new BaseModel();


export default class JobsModel extends BaseModel {

    /**
     * Get a all rows from table.
     *
     * @param {String} tableName The query to match against.
     */
     fetchAllData(tableName = this.table) {
        return knex(tableName)
            .select('id', 'name', 'email', 'country_code', 'dial_code', 'phone', 'job_position', 'resume', 'message')
            .then((res) => {
                return res;
            });
    }


}