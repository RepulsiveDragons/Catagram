const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');


const GramList = (props) => {
  if(props.grams.length === 0){
    return (
      <div className="gramList">
        <h3 className="emptyGram">No CatGrams Yet!</h3>
      </div>
    )
  }

  const galleryNodes = props.grams.reverse().map(gram => {
    let url = `/retrieveGram?_id=${gram._id}`;

    if (gram.mimetype === 'video/mp4') {
      return (
        <div class="gram" key={gram._id}>
          <video controls>
            <source src="url" type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      )      
    }
    
    else if(gram.mimetype === 'image/png' || gram.mimetype === 'image/jpeg' || gram.mimetype === 'image/gif'){
      return (
        <div class="gram" key={gram._id}>
          <img src={url} alt="A Catgram"/>
        </div>
      )
    }})
  

  return (
    <div className="gramList">
      {galleryNodes}
    </div>
  )
}

const loadGramsFromServer = async () => {
  const response = await fetch('/getGrams');
  const data = await response.json();
  ReactDOM.render(
    <GramList grams={data.grams} />,
    document.getElementById('catGrams')
  );
}

const init = () => {
  ReactDOM.render(
    <GramList grams={[]} />,
    document.getElementById ('catGrams')
  );

  loadGramsFromServer();
}

window.onload = init; 