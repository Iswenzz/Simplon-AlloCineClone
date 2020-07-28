module.exports = {
	parser: "postcss-scss",
	plugins: [
		require("postcss-import"),
		require("cssnano")
	]
};
