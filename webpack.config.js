const path = require("path");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

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
		}),
		new ForkTsCheckerWebpackPlugin({ eslint: true })
	],
	module: {
		rules: [
			{	// typescript
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
				options: {
					
				}
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
				test: /\.(js|jsx|ts|tsx)$/,
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
