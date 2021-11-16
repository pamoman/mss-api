/* 
 * API - Apps to excel
 */

const ExcelJS = require('exceljs');

const toExcel = async (domain) => {
    const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet(domain);

        sheet.columns = [
            { header: 'Titel', key: 'title', width: 30 },
            { header: 'Beskrivning', key: 'description', width: 100 },
            { header: 'App Store URL', key: 'appstore_url', width: 50 },
            { header: 'Gratis', key: 'free', width: 10 },
            { header: 'Pris', key: 'price', width: 10 },
        ];

        sheet.getRow(1).font = {
            size: 14,
            bold: true
        };

        const apps = await strapi.query("app").find();

        const rows = apps.map(app => {
            const { title, description, appstore_url, free, price } = app;

            return { title, description, appstore_url, free, price };

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