const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');


const sendGram = async(e) => {
  e.preventDefault();
  const response = await fetch('/postGram',{
    method: 'POST',
    body: new FormData(e.target),
  });

  const text = await response.text();
  console.log(text);

  loadGramsFromServer();

  return false;
};

const isLoggedIn = async() => {
  const response = await fetch('/checkLoggedIn',{
    method: 'GET'
  })

  const result = await response.json();

  if(result.loggedIn){
    ReactDOM.render(
      <CatGramForm />,
      document.getElementById('makeGram')
    );
    uploadGram = document.getElementById('postGramForm');
    uploadGram.addEventListener('submit', sendGram);
  }
  else{
    ReactDOM.render(
      <CatGramFormLoggedOut />,
      document.getElementById('makeGram')
    );
  }
}

const handleUpdate = async (_id, signedNum) => {
  const data = {_id,signedNum}

  const response = await fetch('/updateLikes',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
});

  const text = await response.text();
  console.log(text);

  return false;
}

const CatGramForm = (props) => {
  return(
    <form 
    id='postGramForm' 
    action='/postGram' 
    method='post' 
    encType="multipart/form-data"
    className="domoForm"
    >
      <input type="file" name="mediaFile" />
      <input type="text" name="textInput" />
      <input type='submit' value='Post Gram' />
    </form> 
  )
}

const CatGramFormLoggedOut = (props) => {
  return(
    <div>Log in to make posts
    </div> 
  )
}

const GramList = (props) => {
  if(props.grams.length === 0){
    return (
      <div className="gramList">
        <h3 className="emptyGram">No CatGrams Yet!</h3>
      </div>
    )
  }

  const gramNodes = props.grams.map(gram => {
    let url = `/retrieveGram?_id=${gram._id}`;

    return (
      <div class="card" key={gram._id}>
        <div class="card-content my-4">
          <div class="content">
            {gram.text}
          </div>
          <div class="media">
            <figure class="image">
              <img src={url} alt="A Catgram"/>
            </figure>
          </div>
          <LikeButton likes={gram.likes} _id={gram._id}/>
        </div>
      </div>
    )
  })

  return (
    <div className="domoList">
      {gramNodes}
    </div>
  )
}

const LikeButton = (props) => {
  const [likes, setLikes] = React.useState(props.likes);
  const [isClicked, setIsClicked] = React.useState(false);

  const _id = props._id;

  const handleClick = () => {
    if (isClicked) {
      //handleUpdate(props._id,-1);
      helper.sendPost('/updateLikes', {_id, signedNum: -1})
      setLikes(likes - 1);
    } else {
      //handleUpdate(props._id,1);
      helper.sendPost('/updateLikes', {_id, signedNum: 1})
      setLikes(likes + 1);
    }
    setIsClicked(!isClicked);
  };

  return (
    <button className={ `like-button ${isClicked && 'liked'}` } onClick={ handleClick }>
      <span className="likes-counter">{ `Likes | ${likes}` }</span>
    </button>
  );
};

const loadGramsFromServer = async () => {
  const response = await fetch('/getGrams');
  const data = await response.json();
  ReactDOM.render(
    <GramList grams={data.grams} />,
    document.getElementById('catGrams')
  );
}

const init = () => {
  isLoggedIn();

  ReactDOM.render(
    <GramList grams={[]} />,
    document.getElementById ('catGrams')
  );

  loadGramsFromServer();
}

window.onload = init; 