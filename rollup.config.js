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
  input: 'src/simpla-adapter-netlify-identity.js',
  output: {
    file: 'simpla-adapter-netlify-identity.min.js',
    format: 'umd',
    name: 'SimplaNetlifyIdentity'
  },
  plugins
}]
