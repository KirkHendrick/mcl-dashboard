import types from '../common/actionTypes';
import { apiCallError, beginApiCall } from "./apiStatusActions";
import dashboardApi from "../../api/dashboardApi";
import { formattedRecord } from "../../common/utils";

export function getWeightDataSuccess(weightData) {
	return {type: types.GET_WEIGHT_DATA_SUCCESS, weightData};
}

export function getWeightData() {
	return function (dispatch) {
		dispatch(beginApiCall());
		return dashboardApi.get('weight_data')
			.then(data => {
				dispatch(getWeightDataSuccess(data.map(formattedRecord)));
			})
			.catch(error => {
				dispatch(apiCallError(error));
				console.warn(error);
				throw error;
			});
	}
}