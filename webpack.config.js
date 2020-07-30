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
		extensions: [ ".tsx", ".ts", ".js" ],
	},
	plugins: [
		new StylelintPlugin({
			configFile: ".stylelintrc.json"
		})
	],
	module: {
		rules: [
			{	// typescript
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{	// style & css & postcss & sass loader
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
						loader: "postcss-loader",
						options: {
							sourceMap: true,
							config: {
								path: "postcss.config.js"
							}
						}
					},
					{
						loader: "sass-loader", options: { sourceMap: true }
					}
				]
			},
			{	// babel & eslint
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components|dist)/,
				use: ["babel-loader", "eslint-loader"],
			},
			{	// file loader
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
};
