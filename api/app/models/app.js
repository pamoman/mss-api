'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

/* Data relations must be an ID not a string, convert where needed */
const handleCategory = async (data, name) => {
    const found = await strapi.services.category.findOne({ name });

    let id = 2;

    if (found) {
        id = found.id;
    } else {
        const res = await strapi.services.category.create({ name });

        id = res.id;
    }

    data.category = id;
};

/* Data relations must be an ID not a string, convert where needed */
const handleGenres = async (data, genres) => {
    const genreIds = [];

    for (const name of genres) {
        const found = await strapi.services.genre.findOne({ name });

        let id;

        if (found) {
            id = found.id;
        } else {
            const res = await strapi.services.genre.create({ name });

            id = res.id;
        }

        genreIds.push(id);
    }

    data.genres = genreIds;
};

/* Update app risk level only if dynamic risk is enabled */
const getAppRiskLevel = async (data, risk_assessments) => {
    const { dynamic_risk } = data;

    if (dynamic_risk) {
        data.risk_level = await strapi.config.functions.apps.risk.updateAppRiskLevel(risk_assessments);
    }
};

const handleData = async (data) => {
    const { category, genres, risk_assessments } = data || {};
    const { name } = category || {};

    name && typeof(name) === "string" && await handleCategory(data, name);

    genres && typeof(genres[0]) === "string" && await handleGenres(data, genres);

    await getAppRiskLevel(data, risk_assessments);
};

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            await handleData(data);
        },
        async beforeUpdate(_, data) {
            await handleData(data);
        }
    }
};
