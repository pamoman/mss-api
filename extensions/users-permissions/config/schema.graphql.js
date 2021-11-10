// extensions/users-permissions/config/schema.graphql.js
module.exports = {
    definition: `
        extend type UsersPermissionsMe {
            info: UsersPermissionsUser
        }

        input UserExistsInput {
            username: String!
        }

        type UserExistsPayload {
            username: Boolean!
        }
  `,
    mutation: `
        userExists(input: UserExistsInput!): UserExistsPayload!
  `,
    resolver: {
        UsersPermissionsMe: {
            info: user => user
        },
        Mutation: {
            userExists: {
                resolverOf: 'plugins::users-permissions.user.exists',
                resolver: async (obj, options, { context }) => {
                    const params = options.input;
                    const { username } = params;

                    const data = await strapi.plugins['users-permissions'].controllers.user.exists(username);

                    return data;
                },
            },
        },
    },
}