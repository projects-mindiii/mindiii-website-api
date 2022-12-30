import { StatusCodes } from "http-status-codes";
import { each, forEach } from "lodash";
import tableConstants from "../../../../constants/tableConstants";
import portfolioModel from "../models/portfolioModel";

const protfolioModelObj = new portfolioModel();

export class protfolioService {


    // Portfolio list 
    async portfolioList(req) {
        try {

            const where = { "portfolio.status": 1 };

            var list = await protfolioModelObj.fetchPortfolioListWithSelectedFields(where, ['portfolio.industries_id', "categories.name as industry_name", "portfolio.name as product_name", "portfolio.product_key"], tableConstants.TB_PORTFOLIO);

            list = JSON.parse(JSON.stringify(list))
            var products = [];
            var portfolioArr = [];

            for (let i = 0; i < list.length; i++) {

                let product = list[i],
                    prodIndrusty = product.industry_name,
                    prodIndrustyId = product.industries_id;

                delete product['industries_id']
                delete product['industry_name']

                if (typeof products[prodIndrusty] == 'undefined') {

                    let industry = {
                        "industries_id": prodIndrustyId,
                        "industry_name": prodIndrusty,
                        "products": []

                    }

                    portfolioArr[prodIndrusty] = {}
                    portfolioArr[prodIndrusty] = industry;
                    products[prodIndrusty] = [];
                }


                products[prodIndrusty].push(product);

            }
            var finalResponse = [];
            for (var key in portfolioArr) {
                portfolioArr[key].products = products[key];
                finalResponse.push(portfolioArr[key]);
            }

            let res = {
                status: true,
                status_code: StatusCodes.OK,
                response: finalResponse
            };
            return res;

        } catch (error) {

            console.log(error)
            return error;
        }
    }

    // Portfolio list 
    async portfolioDetail(req) {
        try {

            const where = { "portfolio.product_key": req.query.product_key };

            const productData = await protfolioModelObj.fetchProductDataWithSelectedFields(where, ['portfolio.id', 'portfolio.title', 'portfolio.description', 'portfolio.banner_image', 'portfolio.web_images', 'portfolio.app_images', 'portfolio.end_description', 'portfolio.ios_url', 'portfolio.android_url', 'portfolio.ios_url'], tableConstants.TB_PORTFOLIO);


            let res = {
                status: true,
                status_code: StatusCodes.OK,
                response: {}
            };
            return res;

        } catch (error) {

            console.log(error)
            return error;
        }
    }

}