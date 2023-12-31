const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('catMessage').classList.remove('hidden');
};

const getSessionId = async () => {
  const response = await fetch('/getSessionId',{
    method: 'GET'
  })

  const result = await response.json();

  if(result.error){
    handleError(error);
  }

  return result._id;
}

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('catMessage').classList.add('hidden');

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }

  if(handler) {
    handler(result);
  }
};

const hideError = () => {
  document.getElementById('catMessage').classList.add('hidden');
}

module.exports = {
  handleError,
  sendPost,
  hideError,
  getSessionId,
}