import axios, { AxiosResponse } from "axios";
import { PeopleImageResponse, MediaType, IMedia, MediaResponse, IMovie } from "moviedb";
import { MOVIEDB_API_PERSON_IMAGE, MOVIEDB_IMAGE, MOVIEDB_API_MEDIA, MOVIEDB_API_MEDIAS, MOVIEDB_API_TRENDING, MOVIEDB_API_LATEST } from "./config/api";

export interface QueryMediaOptions 
{
	type?: MediaType,
	page?: number | string
}

/**
 * Query a person portrait image URL.
 * @param id - The person ID.
 */
export const queryPersonImage = async (id: number): Promise<string> =>
{
	try
	{
		const res: AxiosResponse<PeopleImageResponse> = await axios.get(MOVIEDB_API_PERSON_IMAGE(id));
		return res.data.profiles[0] 
			? MOVIEDB_IMAGE(res.data.profiles[0].file_path) 
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
 * @param mediaType - The media type.
 */
export const queryMedia = async (id: number, mediaType: MediaType): Promise<IMedia | null> =>
{
	try
	{
		const res: AxiosResponse<IMedia> = await axios.get(MOVIEDB_API_MEDIA(mediaType, id));
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
			MOVIEDB_API_MEDIAS(options.type, name, options.page));
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
		const res: AxiosResponse<MediaResponse> = await axios.get(MOVIEDB_API_LATEST());
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
		const res: AxiosResponse<MediaResponse> = await axios.get(MOVIEDB_API_TRENDING());
		return res.data.results;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};
