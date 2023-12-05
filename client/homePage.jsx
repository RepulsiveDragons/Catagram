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
  ReactDOM.render(
    <CatGramForm />,
    document.getElementById('makeGram')
  );

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
    className="gramMakerForm"
    >      
      <input type="text" name="textInput" />
      <div class="file has-name is-right">
        <label class="file-label">
          <input class="file-input" type="file" name="mediaFile"/>
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              Choose a file…
            </span>
          </span>
          <span class="file-name">
            myveryawesomecat.png
          </span>
        </label>
      </div>
      <input type='submit' value='Post Gram' />
    </form> 
  )
}

const CatGramFormLoggedOut = (props) => {
  return(
    <div className="gramMakerForm">
      Log in to make posts
    </div> 
  )
}

const GramList = (props) => {
  const handleCommentClick = () => {
    
  }

  if(props.grams.length === 0){
    return (
      <div className="gramList">
        <h3 className="emptyGram">No CatGrams Yet!</h3>
      </div>
    )
  }

  const gramNodes = props.grams.reverse().map(gram => {
    let url = `/retrieveGram?_id=${gram._id}`;

    return (
      <div class="gram" key={gram._id}>
          <h2 className="username">
            {gram.user}
          </h2>
          <div className="textContent">
            {gram.text}
          </div>
          <div className="mediaContainer">
            <figure className="catMedia">
              <img src={url} alt="A Catgram"/>
            </figure>
          </div>
          <div>         
             <LikeButton likes={gram.likes} _id={gram._id}/>
             <button className="commentButton" onClick={ handleCommentClick }>
              <span className="comments-counter">{ `Comments | ${0}` }</span>
            </button>
          </div>

      </div>
    )
  })

  return (
    <div className="gramList">
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
      helper.sendPost('/updateLikes', {_id, signedNum: -1})
      setLikes(likes - 1);
    } else {
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