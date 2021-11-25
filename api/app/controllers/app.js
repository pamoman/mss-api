'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    // GET /apps/dlg
    collect: async ({ params }) => {
        return await strapi.config.functions.apps.collect.appData(params);
    },
    export: async ({ params }) => {
        return await strapi.config.functions.apps.export.appData(params);
    },
    evaluate: async ({ params }) => {
        return await strapi.config.functions.apps.evaluate.appData(params);
    }
};
