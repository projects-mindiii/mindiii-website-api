import { StatusCodes } from "http-status-codes";
import { each, forEach } from "lodash";
import folderConstants from "../../../../constants/folderConstants";
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

            const checkProductKey = await protfolioModelObj.fetchFirstObj({ "portfolio.product_key": req.params.product_key, "portfolio.status": 1 }, tableConstants.TB_PORTFOLIO)
            if (checkProductKey === undefined) {
                let res = {
                    status: false,
                    status_code: StatusCodes.BAD_REQUEST,
                    message: "INVALID_PROJECT_KEY",
                    response: {}
                };
                return res;
            }
            const where = { "portfolio.product_key": req.params.product_key, "portfolio.status": 1 };

            const productData = await protfolioModelObj.fetchProductDataWithSelectedFields(where, ['portfolio.id', 'portfolio.name as project_name', 'portfolio.title', 'portfolio.banner_image', 'portfolio.description', 'portfolio.website_url', 'portfolio.web_images', 'portfolio.app_images', 'portfolio.end_description', 'portfolio.android_url', 'portfolio.ios_url'], tableConstants.TB_PORTFOLIO);

            if (productData.banner_image !== "" || productData.banner_image !== null) {
                productData.banner_image = folderConstants.BANNER_IMAGE + `${productData.banner_image}`
            }

            var web_img = [],
                app_img = [];
            if (productData.web_images.length > 0) {
                productData.web_images = productData.web_images.split(",")
                for (let index = 0; index < productData.web_images.length; index++) {
                    const element = productData.web_images[index];
                    web_img.push(folderConstants.WEB_IMAGE + `${element}`)
                }
                productData.web_images = web_img
            }
            if (productData.app_images.length > 0) {
                productData.app_images = productData.app_images.split(",")

                for (let index = 0; index < productData.app_images.length; index++) {
                    const element = productData.app_images[index];
                    app_img.push(folderConstants.APP_IMAGE + `${element}`)
                }
                productData.app_images = app_img
            }
            let res = {
                status: true,
                status_code: StatusCodes.OK,
                response: { productData }
            };
            return res;

        } catch (error) {

            console.log(error)
            return error;
        }
    }

}