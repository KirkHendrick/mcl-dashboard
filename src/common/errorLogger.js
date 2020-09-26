import { apiCallError } from "../redux/actions/apiStatusActions";

export default function errorLogger(error) {
	console.error(error);
	apiCallError(error);
}