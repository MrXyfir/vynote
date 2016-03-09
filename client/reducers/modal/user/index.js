export default function (state, action) {
	let actionType = action.type.split('/');
	
    if (actionType[2] == "OPEN") {
        return { action: "MODAL/USER/" + actionType[3] };
    }
    else {
        return state;
    }
}