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

const handleGuidelines = async (data, guidelines_link) => {
    if (!guidelines_link) {
        data.guidelines = false;
    } else {
        data.guidelines = true;
    }
};

/* Main */
const handleData = async (data) => {
    const { category, genres, guidelines_link } = data || {};
    const { name } = category || {};

    if (name && typeof(name) === "string") {
        await handleCategory(data, name);
    }

    if (genres && typeof(genres[0]) === "string") {
        await handleGenres(data, genres);
    }

    if (typeof(guidelines_link) !== "undefined") {
        await handleGuidelines(data, guidelines_link);
    }
};

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            await handleData(data);
        },
        async beforeUpdate(params, data) {
            await handleData(data);
        }
    }
};
