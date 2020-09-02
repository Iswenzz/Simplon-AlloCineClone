import { apiKey } from "./key";
import { MediaType } from "moviedb";

/**
 * Query a person portrait image URL.
 * @param id - The person ID.
 */
export const MOVIEDB_API_PERSON_IMAGE = (id: number): string =>
	`https://api.themoviedb.org/3/person/${id}/images?api_key=${apiKey}`;

/**
 * Query a media from its id and type.
 * @param type - The media type.
 * @param id - The media ID.
 */
export const MOVIEDB_API_MEDIA = (type: MediaType, id: number): string =>
	`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-EN&append_to_response=credits,videos,keywords`;
	
/**
 * Query all medias that contains the specified string.
 * @param type - The media type.
 * @param name - The media query string.
 * @param page - The media page.
 */
export const MOVIEDB_API_MEDIAS = (type: MediaType = "multi", name: string, page: string | number = 1): string =>
	`https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-EN&query=${name}&page=${page}&include_adult=false`;

/**
 * Query the latest movies in theatres.
 */
export const MOVIEDB_API_LATEST = (): string =>
	`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-EN&page=1`;

/**
 * Query the trending medias.
 */
export const MOVIEDB_API_TRENDING = (): string =>
	`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

/**
 * Query an image/poster.
 * @param id - The image ID.
 */
export const MOVIEDB_IMAGE = (id: string): string =>
	`https://image.tmdb.org/t/p/w400${id}`;
