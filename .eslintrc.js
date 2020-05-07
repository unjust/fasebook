module.exports = { 
  "extends": ["plugin:react/recommended", "airbnb-base"],
  "env": {
    "browser": true
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
