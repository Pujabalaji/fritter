function viewAllFollowers(fields) {
    fetch(`/api/follow/followers/${fields.username}`, {method: 'GET'})
        .then(showResponse)
        .catch(showResponse);
}

function viewAllFollowees(fields) {
    fetch(`/api/follow/followees/${fields.username}`, {method: 'GET'})
        .then(showResponse)
        .catch(showResponse);
}

function viewFolloweesFreets(fields) {
    fetch(`/api/follow/feed?username=${fields.username}`, {method: 'GET'})
        .then(showResponse)
        .catch(showResponse);
}

function addFollow(fields) {
    fetch(`/api/follow?username=${fields.username}`, {method: 'POST'})
        .then(showResponse)
        .catch(showResponse);
}

function deleteFollow(fields) {
    fetch(`/api/follow?username=${fields.username}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
  