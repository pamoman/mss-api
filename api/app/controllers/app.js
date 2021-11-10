'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    // GET /apps/dlg
    collect: async ({ params }) => {
        return await strapi.config.functions.apps.apps.collectAppData(params);
    },
};