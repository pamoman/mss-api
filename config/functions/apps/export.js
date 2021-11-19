/* 
 * API - Apps to excel
 */

const ExcelJS = require('exceljs');

const getContents = (column = {}, app = {}) => {
    const { key, settings } = column;
    const { is_array, separator = ",", is_nested, nested_prop, is_bool, bool_true, bool_false } = settings || {};

    let val;

    if ([key] in app && app[key] !== null) {
        switch (true) {
            case is_array && is_nested:
                val = app[`${key}`].map(element => {
                    return element[`${nested_prop}`];
                }).join(separator);
                break;
            case is_array:
                val = app[`${key}`].map(element => {
                    return element;
                }).join(separator);
                break;
            case is_nested:
                val = app[`${key}`][`${nested_prop}`];
                break;
            case is_bool:
                val = app[`${key}`] ? bool_true : bool_false;
                break;
            default:
                val = app[`${key}`];
                break;
        }
    }

    return { [key]: val };
};

const toExcel = async (domain) => {
    const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet(domain);
        const { columns } = await strapi.query("excel").findOne() || {};

        sheet.columns = columns.map(column => {
            const { header, key, width } = column;

            return { header, key, width };
        });

        sheet.getRow(1).font = {
            size: 14,
            bold: true
        };

        const apps = await strapi.query("app").find();

        const rows = apps.map(app => {
            const fields = {};
            
            columns.forEach(column => {
                Object.assign(fields, getContents(column, app));
            });

            return fields;
        });

        sheet.addRows(rows);

        await workbook.xlsx.writeFile("./public/apps/bos/excel/apps.xlsx");

        return `
            <h1>Ladda ned filen nedan</h1>
            <a href='/apps/bos/excel/apps.xlsx'>Download</a>
        `;
};

module.exports = {
    appData: async (params) => {
        const { domain, type } = params;
        
        switch (type) {
            case "excel":
                return await toExcel(domain);
        }
    }
};