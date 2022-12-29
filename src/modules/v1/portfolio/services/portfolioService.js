import { StatusCodes } from "http-status-codes";
import tableConstants from "../../../../constants/tableConstants";
import portfolioModel from "../models/portfolioModel";

const protfolioModelObj = new portfolioModel();

export class protfolioService {


    // Portfolio list 
    async portfolioList(req) {
        try {

            const where = { "portfolio.status": 1 };

            const list = await protfolioModelObj.fetchPortfolioListWithSelectedFields(where, ['portfolio.industries_id', "categories.name as industry_name"], tableConstants.TB_PORTFOLIO);

            for (let i = 0; i < list.length; i++) {
                const element = list[i],
                    elementArr = element.product_id.split(","),
                    products = [];

                for (let j = 0; j < elementArr.length; j++) {
                    const arr = elementArr[j];
                    var productData = await protfolioModelObj.fetchPortfolioListDataWithSelectedFields({ "id": arr }, tableConstants.TB_PORTFOLIO);
                    productData.product_key = productData.product_name.toLowerCase().replaceAll(" ", "");
                    products.push(productData)
                }

                element.products = products
                delete element.product_id;
            }
            let res = {
                status: true,
                status_code: StatusCodes.OK,
                response: list
            };
            return res;

        } catch (error) {

            console.log(error)
            return error;
        }
    }
}