/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

 function addBookmark(fields) {
    fetch('/api/bookmark', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function viewAllBookmarks(fields) {
    fetch('/api/bookmark')
      .then(showResponse)
      .catch(showResponse);
  }
function viewProfileBookmarks(fields) {
    fetch(`/api/bookmark?=${fields.profileName}`)
      .then(showResponse)
      .catch(showResponse);
}

function deleteBookmark(fields) {
    fetch(`/api/bookmark/${fields.bookmarkId}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
