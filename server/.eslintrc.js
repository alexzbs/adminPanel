module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
        "mongo": true
    },
    "extends": ["airbnb", "plugin:lodash/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": ["react", "react-hooks", "graphql", "lodash", "mongodb"],
    "rules": {
        "react/jsx-filename-extension": [
            "error",
            { "extensions": [".js", ".jsx"] }
        ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "graphql/template-strings": [
            "error",
            {
                "env": "apollo"
            }
        ],
        "mongodb/no-replace": "error",
        "semi": ["error", "always"],
        "no-console": "off",
        "no-else-return": "off"
    }
}