'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateAppsWithRiskAssessment = async (res) => {
    const { apps } = res;

    for (const app of apps) {
        const { id } = app;

        await strapi.query("app").update({ id }, { forceUpdateRiskLevel: true });
    }
};

module.exports = {
    lifecycles: {
        async afterUpdate(res) {
            await updateAppsWithRiskAssessment(res);
        }
    },
};
