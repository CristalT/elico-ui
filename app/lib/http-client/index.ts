import { HttpClient } from './http-client';

const castorApiClient = new HttpClient(process.env.NEXT_PUBLIC_REY_CASTOR_API!);
const localApiClient = new HttpClient(process.env.NEXT_PUBLIC_LOCAL_API!);

export { castorApiClient, localApiClient, HttpClient };
