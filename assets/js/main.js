M.AutoInit();

autocomplete({
	input: document.getElementById("search"),
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: (text, update) => {
		text = text.toLowerCase();
		queryMovie(text).then(movies => update(movies));
	},
	render: (item) => {
		let div = document.createElement("div");
		div.textContent = item;
		return div;
	}
});

/**
 * Query all movies that contains the specified string.
 * @param {string} name - The movie query string.
 */
const queryMovie = async (name) =>
{
	try
	{
		const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fr-FR&query=${name}&page=1&include_adult=false`);
		const data = res.data.results;

		return data.map(m => m.title);
	}
	catch (e) { }
	return null;
};
