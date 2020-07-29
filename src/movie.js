import queryString from "querystring";
import ProgressBar from "progressbar.js";
import { queryMovie } from "./index";

const movieContent = document.getElementById("movie-content");

const poster = document.getElementById("movie-poster");
const title = document.getElementById("movie-title");
const date = document.getElementById("movie-date");
const genre = document.getElementById("movie-genre");
const duration = document.getElementById("movie-duration");
const rating = document.getElementById("movie-rating");
const description = document.getElementById("movie-description");


const ratingCircle = rating ? new ProgressBar.Circle(rating, {
	strokeWidth: 10,
	easing: "easeInOut",
	duration: 1400,
	color: "#9b00c4",
	trailColor: "#eee",
	trailWidth: 3,
	svgStyle: null,
	text: {
		autoStyleContainer: false
	},
	step: (state, circle) => 
	{
		let value = Math.round(circle.value() * 100);
		circle.setText(value + "%");
	}
}) : null;

/**
 * Render a movie from url query.
 */
export const renderMovie = async () =>
{
	if (!movieContent)
		return;
	
	const query = queryString.parse(location.search);
	const data = await queryMovie(query["?id"]);
	console.log(data);
	
	const bg = data.backdrop_path 
		? `https://image.tmdb.org/t/p/original${data.backdrop_path}` 
		: "./assets/images/empty_portrait.webp";
	const lbg = "linear-gradient(rgba(0, 100, 200, 0.8), rgba(7, 0, 93, 0.8))";
	movieContent.setAttribute("style", `background: ${lbg}, url(${bg})`);
	poster.src = data.poster_path 
		? `https://image.tmdb.org/t/p/original${data.poster_path}` 
		: "./assets/images/empty_portrait.webp";

	title.innerText = data.title;
	description.innerText = data.overview;

	date.setAttribute("datetime", data.release_date);
	date.innerText = new Date(data.release_date).toLocaleDateString();
	genre.innerText = data.genres.map(g => g.name).join(", ");
	const hours = Math.floor(data.runtime / 60);
	const minutes = data.runtime % 60;
	duration.innerText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

	ratingCircle.animate(data.vote_average / 10);
};
