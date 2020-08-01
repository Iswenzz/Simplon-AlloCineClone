import "./assets/scss/movie.scss";
import { parse, ParsedUrlQuery } from "querystring";
import ProgressBar from "progressbar.js";
import { queryMovie, queryPersonImage } from "./index";
import YouTubePlayer from "youtube-player";
import { ICast, IMovie, IVideo } from "moviedb";

const movieContent = document.getElementById("movie-content") as HTMLElement;
const movieCasting = document.getElementById("casting-content") as HTMLElement;

const poster = document.getElementById("movie-poster") as HTMLImageElement;
const title = document.getElementById("movie-title") as HTMLHeadingElement;
const date = document.getElementById("movie-date") as HTMLDataElement;
const genre = document.getElementById("movie-genre") as HTMLDivElement;
const duration = document.getElementById("movie-duration") as HTMLDivElement;
const rating = document.getElementById("movie-rating") as HTMLDivElement;
const description = document.getElementById("movie-description") as HTMLDivElement;

const status = document.getElementById("movie-status") as HTMLParagraphElement;
const language = document.getElementById("movie-language") as HTMLParagraphElement;
const budget = document.getElementById("movie-budget") as HTMLParagraphElement;
const revenue = document.getElementById("movie-revenue") as HTMLParagraphElement;
const keywords = document.getElementById("movie-keywords") as HTMLDivElement;

const ratingCircle: any = rating ? new ProgressBar.Circle(rating, {
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
	step: (state: any, circle: any) => 
	{
		const value = Math.round(circle.value() * 100);
		circle.setText(value + "%");
	}
}) : null;

/**
 * Render all actors/cast that played in the movie.
 * @param movieData - The movie result data.
 */
export const renderCast = async (movieData: IMovie): Promise<void> =>
{
	const limit: boolean = movieData.credits.cast.length > 10;
	for (let i = 0; i < (limit ? 10 : movieData.credits.cast.length); i++)
	{
		const c: ICast = movieData.credits.cast[i];

		const card: HTMLElement = document.createElement("article");
		const cardHeader: HTMLDivElement = document.createElement("div");
		const cardBody: HTMLDivElement = document.createElement("div");
		const cardImage: HTMLImageElement = document.createElement("img");
		const cardTitle: HTMLHeadingElement = document.createElement("h4");
		const cardDesc: HTMLParagraphElement = document.createElement("p");

		card.classList.add("card", "grey", "darken-4");
		cardHeader.classList.add("card-image", "waves-effect", "waves-light");
		cardBody.classList.add("card-content");

		const imgUrl: string = await queryPersonImage(c.id);
		cardImage.src = imgUrl ? imgUrl : "";
		cardTitle.innerText = c.name;
		cardDesc.innerText = c.character;
		
		cardHeader.appendChild(cardImage);
		cardBody.appendChild(cardTitle);
		cardBody.appendChild(cardDesc);
		card.appendChild(cardHeader);
		card.appendChild(cardBody);
		movieCasting.appendChild(card);
	}
};

/**
 * Render extra infos aside.
 * @param movieData - The movie result data.
 */
export const renderAside = async (movieData: IMovie): Promise<void> =>
{
	const dollarFormater: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	status.innerText = movieData.status;
	language.innerText = movieData.spoken_languages[0] 
		? movieData.spoken_languages[0].name : "Unknown";
	budget.innerText = dollarFormater.format(movieData.budget);
	revenue.innerText = dollarFormater.format(movieData.revenue);
	
	for (const word of movieData.keywords.keywords)
	{
		const k: HTMLLIElement = document.createElement("li");
		k.classList.add("z-depth-2", "waves-effect", "waves-light");
		k.innerText = word.name;
		keywords.appendChild(k);
	}
};

/**
 * Render the movie trailer using YT Player.
 * @param movieData - The movie result data.
 */
export const renderTrailer = async (movieData: IMovie): Promise<void> =>
{
	const trailer: IVideo = movieData.videos.results[0];
	if (!trailer) return;

	const player: any = YouTubePlayer("movie-video");
	player.loadVideoById(trailer.key);
};

/**
 * Render a movie from url query.
 */
export const renderMovie = async (): Promise<void> =>
{
	if (!movieContent)
		return;
	
	// query movie content data
	const query: ParsedUrlQuery = parse(location.search);
	const movieId: number = parseInt(query["?id"] as string, 10);
	const data: IMovie = await queryMovie(movieId);
	console.log(data);

	// movie poster & background
	const bg: string = data.backdrop_path 
		? `https://image.tmdb.org/t/p/w400${data.backdrop_path}` 
		: "./src/assets/images/empty_portrait.webp";
	const lbg = "linear-gradient(rgba(0, 100, 200, 0.8), rgba(7, 0, 93, 0.8))";
	movieContent.setAttribute("style", `background: ${lbg}, url(${bg})`);
	poster.src = data.poster_path 
		? `https://image.tmdb.org/t/p/w400${data.poster_path}` 
		: "./src/assets/images/empty_portrait.webp";

	// movie title & description
	title.innerText = data.title;
	description.innerText = data.overview;

	// movie date & genre & duration
	date.setAttribute("datetime", data.release_date);
	date.innerText = new Date(data.release_date).toLocaleDateString();
	genre.innerText = data.genres.map(g => g.name).join(", ");
	const hours: number = Math.floor(data.runtime / 60);
	const minutes: number = data.runtime % 60;
	duration.innerText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

	// movie rating
	ratingCircle.animate(data.vote_average / 10);

	renderTrailer(data);
	renderCast(data);
	renderAside(data);
};
