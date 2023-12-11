const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//Similar to the component in homePage.jsx but displays only the media that the user has posted
const GalleryList = (props) => {
  if(props.grams.length === 0){
    return (
      <div className="gramList">
        <h3 className="emptyGram">No CatGrams Yet!</h3>
      </div>
    )
  }

  const galleryNodes = props.grams.map(gram => {
    let url = `/retrieveGram?_id=${gram._id}`;

    if (gram.mimetype === 'video/mp4') {
      return (
        <div class="galleryGram" key={gram._id}>
          <video controls>
            <source src={url} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      )      
    }
    
    else if(gram.mimetype === 'image/png' || gram.mimetype === 'image/jpeg' || gram.mimetype === 'image/gif'){
      return (
        <div class="galleryGram" key={gram._id}>
          <img src={url} alt="A Catgram"/>
        </div>
      )
    }})
  

  return (
    <div id="galleryList">
      {galleryNodes}
    </div>
  )
}

//Get request to fetch all the user made posts
const loadGalleryGramsFromServer = async () => {
  const user_id = await helper.getSessionId();
  console.log(user_id);

  const response = await fetch(`/getGalleryGrams?user_id=${user_id}`);
  const data = await response.json();
  ReactDOM.render(
    <GalleryList grams={data.grams} />,
    document.getElementById('galleryGrams')
  );
}

const init = () => {
  ReactDOM.render(
    <GalleryList grams={[]}/>,
    document.getElementById('galleryGrams')
  );

  loadGalleryGramsFromServer();
}

window.onload = init; 