'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

 const formatMyDate = (value, locale = 'sv-SV') => {
    return new Date(value).toLocaleDateString(locale);
};

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

const handleGuidelines = async (data, guidelines_link) => {
    if (!guidelines_link) {
        data.guidelines = false;
    } else {
        data.guidelines = true;
    }
};

/* Update app risk level only if dynamic risk is enabled */
const handleRiskLevel = async (data, risk_assessments) => {
    const { id } = await strapi.config.functions.apps.risk.updateAppRiskLevel(risk_assessments);

    data.risk_level = id;
};

/* Update the dates when changing risk levels */
const handleRiskDates = async (data, date_confirmed) => {
    const { risk_level } = data;
    const { level } = await strapi.query("risk-level").findOne({ id: risk_level });

    switch (true) {
        case level === 0:
            data.date_confirmed = null;
            data.date_revised = null;
            break;
        case (level > 0 && date_confirmed === null):
            data.date_confirmed = formatMyDate(new Date());
            break;
        case (level > 0 && date_confirmed != null):
            data.date_revised = formatMyDate(new Date());
            break;
        default:
            break;
    }
};

/* Main */
const handleData = async (data, id = null) => {
    const { category, genres, guidelines_link } = data || {};
    let { name } = category || {};

    if (name && typeof(name) === "string") {
        await handleCategory(data, name);
    }

    if (genres && typeof(genres[0]) === "string") {
        await handleGenres(data, genres);
    }

    if (typeof(guidelines_link) !== "undefined") {
        await handleGuidelines(data, guidelines_link);
    }

    if (data?.risk_assessments || data?.risk_level || data?.forceUpdateRiskLevel) {
        let fields;

        if (id) {
            const res = await strapi.query("app").findOne({ id }, ["risk_assessments", "risk_assessments.risk_level"]);

            fields = {...res, ...data };

        } else {
            fields = { ...data };
        }

        const { dynamic_risk, risk_assessments, date_confirmed } = fields;

        if (dynamic_risk) {
            await handleRiskLevel(data, risk_assessments);
        }

        await handleRiskDates(data, date_confirmed);

        delete data.forceUpdateRiskLevel;
    }
};

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            await handleData(data);
        },
        async beforeUpdate(params, data) {
            const { id } = params;

            await handleData(data, id);
        }
    }
};
