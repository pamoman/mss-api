'use strict';

/*
 * Get Jamf apps and insert into App collection
 */

/*
 * Global variables
 */

const validTypes = ["all", "appstore", "jamf", "appstore-dev"];

let domain, type, fields = {};

/* 
 * Merge 2 object properties.
 * The properties are overwritten by other objects that
 * have the same properties later in the parameters order.
 */
const mergeFields = (data) => {
    fields = { ...fields, ...data };
};

/*
 * Collect app data
 */
const collect = async (app) => {
    const { jamf, appstore } = strapi.config.functions.apps;

    try {
        switch (type) {
            case "all":
                mergeFields(await jamf.getMobileAppData(domain, app.id));
                mergeFields(await appstore.getAppStoreApp(fields.bundle_id));
                mergeFields(await appstore.getAppStorePrivacy(fields.appstore_id));
                mergeFields(await appstore.getAppStoreDev(fields.appstore_url));
                break;
            case "appstore":
                mergeFields(await jamf.getMobileAppData(domain, app.id));
                mergeFields(await appstore.getAppStoreApp(fields.bundle_id));
                mergeFields(await appstore.getAppStorePrivacy(fields.appstore_id));
                break;
            case "jamf":
                mergeFields(await jamf.getMobileAppData(domain, app.id));
                break;
            case "appstore-dev":
                const { bundle_id, appstore_url } = app;

                mergeFields({ bundle_id });
                mergeFields(await appstore.getAppStoreDev(appstore_url));
                break;
            
            default:
                break;
        }

        return fields;
    } catch (e) {
        strapi.log.fatal(e.message);

        return {};
    }
};

/*
 * Main function
 */
const createOrUpdateApps = async () => {
    const { jamf } = strapi.config.functions.apps;
    const props = {};

    let data, count = 0;

    if (type === "appstore-dev") {
        data = await strapi.query("app").find();
    } else {
        data = await jamf.getMobileApps(domain);
    }

    for (const app of data.slice(0, 5)) {
        const updatedApp = await collect(app);

        await strapi.services.app.createOrUpdate(updatedApp);
        
        // Important: Clear fields before next loop
        fields = {}

        count++;
    };

    return { jamf: "Mobile Apps", count };
};

module.exports = {
    appData: async (params) => {
        domain = params.domain;
        type = params.type;

        return validTypes.includes(type)
            ? await createOrUpdateApps()
            : strapi.log.fatal("Invalid params!");
    },
};