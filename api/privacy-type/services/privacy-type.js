'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    createOrUpdate: async (data) => {
        let res =  await strapi.query("privacy-type").findOne(data);

        if (!res) {
            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models["privacy-type"],
                data,
                { isDraft: isDraft(data, strapi.models["privacy-type"]) }
            );

            return await strapi.query("privacy-type").create(validData);
        }

        return res;
    }
};
