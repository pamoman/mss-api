'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    createOrUpdate: async (data) => {
        let res =  await strapi.query("data-type").findOne(data);

        if (!res) {
            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models["data-type"],
                data,
                { isDraft: isDraft(data, strapi.models["data-type"]) }
            );

            return await strapi.query("data-type").create(validData);
        }

        return res;
    }
};
