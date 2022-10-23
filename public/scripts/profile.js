/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function createProfile(fields) {
    fetch('/api/profile', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
    console.log("called POST method");
}

function viewUserProfiles(fields) {
    fetch(`/api/profile?username=${fields.username}`)
      .then(showResponse)
      .catch(showResponse);
  }

function deleteProfile(fields) {
    fetch(`/api/profile/${fields.profileName}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
