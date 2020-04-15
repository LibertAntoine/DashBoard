module.exports = {
  runtimeCompiler: true,
	configureWebpack(config) {
		if (process.env.TEST) {
			console.log("TEST MODE")
			config.entry.app = './src/tests/main.js'
		}
	}
}
