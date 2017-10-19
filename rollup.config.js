// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import ownPackage from './package.json'

const debugging = process.argv.includes('--debug')

let plugins = [
  babel(),
  resolve(),
  replace({
    VERSION: JSON.stringify(ownPackage.version)
  })
]

if (!debugging) {
  plugins.push(uglify())
}

export default [{
  input: 'src/netlify-identity-adapter.js',
  output: {
    file: 'netlify-identity-adapter.min.js',
    format: 'umd',
    name: 'SimplaNetlifyIdentity'
  },
  plugins
}]
