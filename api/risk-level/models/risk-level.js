'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

 const check = async (data) => {
    const isDefault = data.default;

    if (isDefault) {
        const res = await strapi.query("risk-level").findOne({ default: true });

        if (res) {
            const { id } = res;
            await strapi.query("risk-level").update({ id }, { default: false } );
        }
    }
}

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            await check(data);
        },
        async beforeUpdate(_, data) {
            await check(data);
        }
    },
};
