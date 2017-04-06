module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "installedESLint": true,
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        //如果使用了react，请在rule里加上如下规则
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        //去掉对缩进的警告，不然很烦人
        "indent": [
                      "off",
                      "tab"
                  ],
        //允许使用console, alert
        "no-console": 0,
        "no-alert": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
