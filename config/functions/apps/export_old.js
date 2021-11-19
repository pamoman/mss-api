/* 
 * API - Apps to excel
 */

const ExcelJS = require('exceljs');

const toExcel = async (domain) => {
    const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet(domain);

        sheet.columns = [
            { header: 'Title', key: 'title', width: 30 },
            { header: 'GDPR-status', key: 'risk_level', width: 30 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Img', key: 'icon', width: 30 },
            { header: 'Link', key: 'appstore_url', width: 30 },
            { header: 'Fri sökning', key: 'free_search', width: 30 },
            { header: 'Sök via kategorier', key: 'genres', width: 30 },
            { header: 'PUB-avtal', key: 'pub', width: 30 },
            { header: 'Kostnad', key: 'free', width: 30 },
            { header: 'Riktlinjer', key: 'guidelines', width: 30 },
            { header: 'Länk', key: 'guidelines_link', width: 30 },
            { header: 'Övrig info', key: 'information', width: 30 },
            { header: 'Icon', key: 'icon_alt', width: 30 },
            { header: 'Icont', key: 'devices_icon', width: 30 },
            { header: 'Typ', key: 'devices', width: 30 },
            { header: 'View', key: 'view', width: 30 },
            { header: 'Datum för godkännande', key: 'date_confirmed', width: 30 },
            { header: 'Senast reviderad', key: 'last_reviewed', width: 30 },
        ];

        sheet.getRow(1).font = {
            size: 14,
            bold: true
        };

        const apps = await strapi.query("app").find();

        const rows = apps.map(app => {
            let { title, risk_level, description, icon, appstore_url, genres, free, devices } = app;

            risk_level = risk_level?.name;
            genres = genres.map(genre => genre.name).join(",");
            devices = devices.map(device => device.name).join(",");

            return { title, risk_level, description, icon, appstore_url, genres, free, devices };

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