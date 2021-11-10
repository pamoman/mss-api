'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    createOrUpdate: async (data) => {
        let res =  await strapi.query("data-purpose").findOne(data);

        if (!res) {
            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models["data-purpose"],
                data,
                { isDraft: isDraft(data, strapi.models["data-purpose"]) }
            );

            return await strapi.query("data-purpose").create(validData);
        }

        return res;
    }
};
