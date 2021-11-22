/* 
 * API - Apps to excel
 */

const ExcelJS = require('exceljs');

const getContents = (column = {}, app = {}) => {
    const { helper } = strapi.config.functions.apps;
    const { key, settings } = column;
    const { separator = ", ", nested_prop = "name", bool_true = "Yes", bool_false = "No" } = settings || {};
    const appKey = app[key];

    const { isUndefined, isNull, isArray, isNested, isBool } = helper.getTypeOf(appKey);

    let val;

    if (!isUndefined || !isNull) {
        switch (true) {
            case isArray && isNested:
                val = appKey.map(element => {
                    return element[nested_prop];
                }).join(separator);
                break;
            case isArray:
                val = appKey.map(element => {
                    return element;
                }).join(separator);
                break;
            case isNested:
                val = appKey[nested_prop];
                break;
            case isBool:
                val = appKey ? bool_true : bool_false;
                break;
            default:
                val = appKey;
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