import axios, { AxiosResponse } from "axios";
import { PeopleImageResponse, MediaType, IMedia, MediaResponse, IMovie } from "moviedb";
import { apiKey } from "./config/key";
import { QueryMediaOptions } from "./index";

/**
 * Query a person portrait image URL.
 * @param id - The person ID.
 */
export const queryPersonImage = async (id: number): Promise<string> =>
{
	try
	{
		const res: AxiosResponse<PeopleImageResponse> = await axios.get(
			`https://api.themoviedb.org/3/person/${id}/images?api_key=${apiKey}`);
		return res.data.profiles[0] 
			? `https://image.tmdb.org/t/p/w400${res.data.profiles[0].file_path}` 
			: require("./assets/images/empty_portrait.webp").default;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query a media from its id.
 * @param id - The media ID.
 */
export const queryMedia = async (id: number, mediaType: MediaType): Promise<IMedia | null> =>
{
	try
	{
		const res: AxiosResponse<IMedia> = await axios.get(
			`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-EN&append_to_response=credits,videos,keywords`);
		return res.data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query all medias that contains the specified string.
 * @param name - The media query string.
 * @param options - Query options (page, media_type).
 */
export const queryMedias = async (name: string, options: QueryMediaOptions): Promise<MediaResponse | null> =>
{
	try
	{
		const res: AxiosResponse<MediaResponse> = await axios.get(
			`https://api.themoviedb.org/3/search/${options.type ?? "multi"}?api_key=${apiKey}&language=en-EN&query=${name}&page=${options.page ?? 1}&include_adult=false`);
		return res.data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query the latest movies in theatres.
 */
export const queryLatest = async (): Promise<IMovie[] | null> =>
{
	try
	{
		const res: AxiosResponse<MediaResponse> = await axios.get(
			`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-EN&page=1`);
		return res.data.results as IMovie[];
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query the trending medias.
 */
export const queryTrending = async (): Promise<IMedia[] | null> =>
{
	try
	{
		const res: AxiosResponse<MediaResponse> = await axios.get(
			`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`);
		return res.data.results;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};
