const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('domoMessage').classList.remove('hidden');
};

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
  document.getElementById('domoMessage').classList.add('hidden');

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

const sendGram = async(e) => {
  const response = await fetch('/postGram',{
    method: 'POST',
    body: new FormData(),
  });

  const text = await response.text();
  console.log(text);
};

const hideError = () => {
  document.getElementById('domoMessage').classList.add('hidden');
}

module.exports = {
  handleError,
  sendPost,
  sendGram,
  hideError,
}