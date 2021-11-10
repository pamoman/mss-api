'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateAppsWithRiskAssessment = async (res) => {
    const { apps } = res;

    for (const app of apps) {
        const { id, dynamic_risk } = app;

        if (dynamic_risk) {

            const res = await strapi.query("app").findOne({ id }, ["risk_assessments", "risk_assessments.risk_level"]);

            const { risk_assessments } = res;

            const risk_level = await strapi.config.functions.apps.risk.updateAppRiskLevel(risk_assessments);

            await strapi.query("app").update({ id }, { risk_level });
        }
    }
};

module.exports = {
    lifecycles: {
        async afterUpdate(res) {
            await updateAppsWithRiskAssessment(res);
        }
    },
};
