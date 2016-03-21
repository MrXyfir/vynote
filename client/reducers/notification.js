import {
    ERROR, SUCCESS, INFO, CLEAR, ADVERT
} from "../constants/action-types/notifications";

export default function (state, action) {
	if (action.type.split('/')[0] == "NOTIFICATION") {
		switch (action.type) {
			case ERROR:
				return { status: "error", message: action.message };
			case SUCCESS:
				return { status: "success", message: action.message };
			case INFO:
				return { status: "info", message: action.message };
			case CLEAR:
                return { status: "clear", message: "" };
            case ADVERT:
                return { status: "advert", ad: action.ad };
			default:
				return state;
		}	
	}
	else {
		return state;
	}
}