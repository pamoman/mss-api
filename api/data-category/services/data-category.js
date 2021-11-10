'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    createOrUpdate: async (data) => {
        let res =  await strapi.query("data-category").findOne(data);

        if (!res) {
            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models["data-category"],
                data,
                { isDraft: isDraft(data, strapi.models["data-category"]) }
            );

            return await strapi.query("data-category").create(validData);
        }

        return res;
    }
};
