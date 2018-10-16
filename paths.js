const path = require('path')

const root = __dirname
const appRoot = root + '/app'
const buildRoot = root + '/build'
const distRoot = root + '/dist'

module.exports = {
	app: {
		root: appRoot,
		plugins: appRoot + "/plugins",
		manifest$: appRoot + "/manifest.json"
	},
	build: {
		dist: distRoot,
		done: buildRoot + "/done",
		src: buildRoot + "/src"
	},
	project: {
		config$: path.resolve(__dirname + '/config.js')
	},
	git: {
		root$: path.resolve(__dirname)
	}
}