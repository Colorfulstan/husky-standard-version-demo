const path = require('path')

const root = __dirname
const appRoot = root + '/app'

module.exports = {
	app: {
		root: appRoot,
		manifest$: appRoot + "/manifest.json"
	},
	project: {
		config$: path.resolve(root + '/config.js'),
		pckg$: path.resolve(root + '/package.json'),
	},
	git: {
		root$: path.resolve(root)
	}
}