'use strict';

module.exports = {
    /**
     * Check if a user exists.
     * @return {Object}
     */
    async exists(username) {
        const data = await strapi.plugins['users-permissions'].services.user.fetch({ username });

        let res = { username: data ? true: false };

        return res;
    }
};