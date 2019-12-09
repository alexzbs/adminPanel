/* eslint-disable */

module.exports = {
  client: {
    includes: ['./client/src/**/*.{ts,tsx,js,jsx,graphql}'],
    excludes: ['**/node_modules/**'],
    service: {
      name: 'vscode graphql client',
      // url: 'https://localhost:443/graphql',
      // // headers: {
      // //   authorization: 'Bearer lkjfalkfjadkfjeopknavadf'
      // // },
      // skipSSLValidation: true,
      localSchemaFile: './server/graphql/schema.graphql'
      // endpoint: {
      //   name: 'vscode graphql server',
      //   url: 'https://localhost:443/graphql',
      //   // headers: {
      //   //   authorization: 'Bearer lkjfalkfjadkfjeopknavadf'
      //   // },
      //   skipSSLValidation: true,
      //   // localSchemaFile: './path/to/schema.graphql'
      // },
    },
  },
};
