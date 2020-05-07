module.exports = { 
  "extends": ["plugin:react/recommended", "airbnb-base"],
  "plugins": ["jest"],
  "env": {
    "browser": true,
    "jest/globals": true
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "comma-dangle": ["error", "never"],
    "implicit-arrow-linebreak": "off",
    "operator-linebreak": "off"
  }
}
