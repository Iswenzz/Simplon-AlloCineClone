import "./assets/scss/index.scss";
import "materialize-css";
import axios from "axios";
import autocomplete from "autocompleter";
import { apiKey } from "./config/key.js";

M.AutoInit();
const cardContainer = document.getElementById("card-box");
const searchHeader = document.getElementById("header-title");

/**
 * Search bar autocomplete configuration.
 */
autocomplete({
	input: document.getElementById("search"),
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: (text, update) => {
		text = text.toLowerCase();
		searchHeader.innerText = text ? `"${text.toUpperCase()}" sur Allociné` : "Recherche sur Allociné";
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
		renderCard(data);
		console.log(data);

		return data.map(m => m.title);
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * When clicking on a card image/title callback.
 * @param {MouseEvent} e - The mouse event.
 */
const selectCard = (e) =>
	window.location.href = `movie.html?id=${e.target.getAttribute("data-id")}`;

/**
 * Create all DOM cards elements.
 * @param {any[]} data - The movie data array.
 */
const renderCard = (data) =>
{
	cardContainer.innerHTML = "";

	for (const c of data)
	{
		const card = document.createElement("article");
		const cardHeader = document.createElement("header");
		const img = document.createElement("img");
		const title = document.createElement("a");
		const cardBody = document.createElement("section");
		const cardBodyAction = document.createElement("section");
		const desc = document.createElement("p");

		// Card poster
		if (c.poster_path)
			img.src = `https://image.tmdb.org/t/p/original/${c.poster_path}`;
		else
			img.src = "./assets/images/empty_portrait.webp";
		img.setAttribute("data-id", c.id);
		img.style.width = "100%";
		img.style.height = "100%";

		// Card header
		cardHeader.setAttribute("data-id", c.id);
		cardHeader.addEventListener("click", selectCard);
		cardHeader.classList.add("waves-effect", "waves-light");
		cardHeader.appendChild(img);

		// Card title
		title.setAttribute("data-id", c.id);
		title.addEventListener("click", selectCard);
		title.innerText = c.title;

		cardBodyAction.classList.add("card-action");
		cardBodyAction.appendChild(title);

		// Card description
		let descStr = c.overview;
		if (descStr.length > 200)
			descStr = descStr.substr(0, 199) + "...";
		desc.innerText = descStr;
		cardBody.appendChild(cardBodyAction);
		cardBody.appendChild(desc);
		
		// Card content
		card.classList.add("card");
		cardHeader.classList.add("class-image");
		card.appendChild(cardHeader);
		cardBody.classList.add("card-content");
		card.appendChild(cardBody);

		cardContainer.appendChild(card);
	}
};
