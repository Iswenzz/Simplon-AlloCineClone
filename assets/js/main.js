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
		const data = res.data.results.sort((a, b) => a.title.localeCompare(b.title));
		drawCards(data);

		return data.map(m => m.title);
	}
	catch (e) { }
	return null;
};

const drawCards = (cards) =>
{
	const cardContainer = document.getElementById("card-box");
	cardContainer.innerHTML = "";

	for (const c of cards)
	{
		const card = document.createElement("article");
		const cardHeader = document.createElement("header");
		const img = document.createElement("img");
		const title = document.createElement("span");
		const cardBody = document.createElement("section");
		const desc = document.createElement("p");

		img.src = `https://image.tmdb.org/t/p/original/${c.poster_path}`;
		img.classList.add("responsive-img");
		img.height = 256;
		cardHeader.appendChild(img);
		title.innerText = c.title;

		title.classList.add("card-title");
		cardBody.appendChild(title);
		let descStr = c.overview;
		if (descStr.length > 100)
			descStr = descStr.substr(0, 99) + " ...";
		desc.innerText = descStr;
		cardBody.appendChild(desc);
		
		card.classList.add("card");
		cardHeader.classList.add("class-image");
		card.appendChild(cardHeader);
		cardBody.classList.add("card-content");
		card.appendChild(cardBody);

		cardContainer.appendChild(card);
	}
};
