'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    createOrUpdate: async (data) => {
        const { bundle_id } = data;
        const res =  await strapi.query("app").findOne({ bundle_id });

        if (res) {
            const { id, dynamic_risk } = res;

            /* Keep the following data and settings */
            data.dynamic_risk = dynamic_risk;

            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models["app"],
                data,
                { isDraft: isDraft(data, strapi.models["app"]) }
            );

            strapi.log.info(`Updating ${bundle_id}.`);

            return await strapi.query("app").update({ id }, validData);
        } else {
            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models["app"],
                data,
                { isDraft: isDraft(data, strapi.models["app"]) }
            );

            strapi.log.info(`Inserting ${bundle_id} into the database.`);

            return await strapi.query("app").create(validData);
        }
    }
};
