const path = require("path");
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./src/index.ts",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolve: {
		extensions: [ ".tsx", ".jsx", ".ts", ".js" ],
	},
	plugins: [
		new StylelintPlugin({
			configFile: ".stylelintrc.json"
		})
	],
	module: {
		rules: [
			{	// typescript
				test: /\.(ts|tsx)$/,
				loader: "ts-loader",
			},
			{	// eslint typescript
				enforce: "pre",
				test: /\.(ts|tsx)$/,
				exclude: /(node_modules|dist)/,
				loader: "eslint-loader"
			},
			{	// file loader
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
			{	// style & css & sass & postcss loader
				test: /\.s[ac]ss$/i,
				use: [
					{ 
						loader: "style-loader" 
					},
					{
						loader: "css-loader", 
						options: {
							sourceMap: true
						}
					},
					{
						loader: "sass-loader", options: { sourceMap: true }
					},
					{
						loader: "postcss-loader",
						options: {
							sourceMap: true,
							config: {
								path: "postcss.config.js"
							}
						}
					}
				]
			}
		]
	}
};
