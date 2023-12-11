const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//A post request sending an optional text input and a required media file
const sendGram = async(e) => {
  e.preventDefault();
  const response = await fetch('/postGram',{
    method: 'POST',
    body: new FormData(e.target),
  });

  const result = await response.json();
  document.getElementById('catMessage').classList.add('hidden');

  if(result.error) {
    helper.handleError(result.error);
  }

  loadGramsFromServer();
  ReactDOM.render(
    <CatGramForm />,
    document.getElementById('makeGram')
  );

  return false;
};

//Checks if the user is logged in and displays the appropriate html 
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
    ReactDOM.render(
      <LoggedInNavbar />,
      document.getElementById('navbarContent')
    );
    uploadGram = document.getElementById('postGramForm');
    uploadGram.addEventListener('submit', sendGram);
  }
  else{
    ReactDOM.render(
      <CatGramFormLoggedOut />,
      document.getElementById('makeGram')
    );

    ReactDOM.render(
      <LoggedOutNavbar />,
      document.getElementById('navbarContent')
    );
  }
}

//Post request for a user wanting to post a comment to a catgram
const handlePostComment = (e) => {
  e.preventDefault();

  const comment = e.target.querySelector('#commentInput').value;
  const _id = e.target.getAttribute('_id');

  if(!comment){
    helper.handleError('Write a comment before submitting');
    return false;
  }

  helper.sendPost(e.target.action, {_id: _id, comment: comment});

  loadCommentsFromServer(_id);

  return false;
}

//component for the navbar when a user is logged out
const LoggedOutNavbar = (props) => {
  return(
    <div class="navbar-end">
      <a class="navbar-item" href="/login">Log In</a>
    </div>
  )
}

//component for a navbar when the user is logged in
const LoggedInNavbar = (props) => {
  return(
    <div class="navbar-start">
      <a class="navbar-item" href="/homePage">
        Home
      </a>

      <a class="navbar-item" href="/gallery">
        Gallery
      </a>

      <a class="navbar-item" href="/changePassword">
        Change Password
      </a>

      <a class="navbar-item" href="/logout">Log Out</a>
    </div>
  )
}

//the main form for the user to submit a catgram
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

//displays a message instead of the main form if the user is not logged in
const CatGramFormLoggedOut = (props) => {
  return(
    <div className="gramMakerForm">
      Log in to make posts
    </div> 
  )
}

//Component for the comment menu
//this menu will be hidden until the user clicks on a comment button
//has html for a form to submit comments
//and will display all the available comments of that catgram
const CommentList = (props) => {
  if(props.comments.length === 0){
    return (
      <div className="commentsContent">
        <div className="commentFormDiv">
          <form 
          id='postComment' 
          action='/postComment' 
          onSubmit={handlePostComment}
          method='post' 
          className="commentForm"
          _id={props._id}
          >      
            <input id="commentInput" type="text" name="textInput"/>
            <input id="submitComment" type='submit' value='Post Comment'/>
          </form> 
        </div>
        <div className="noCommentDiv">
          <h2 className="noComments">This post has no comments yet!</h2>
        </div>
      </div>
    )
  }

  const commentNodes = props.comments.map(comment => {
    return (
      <div class="commentDiv" key={comment._id}>
          <h2 className="comment">
            {comment}
          </h2>
      </div>
    )
  })

  return (
    <div className="commentsContent">
      <div className="commentFormDiv">
        <form 
        id='postComment' 
        action='/postComment' 
        onSubmit={handlePostComment}
        method='post' 
        className="commentForm"
        _id={props._id}
        >      
          <input id="commentInput" type="text" name="textInput"/>
          <input id="submitComment" type='submit' value='Post Comment'/>
        </form> 
      </div>
      <div className="commentsDiv">
        {commentNodes}
      </div>
    </div>
    
  )

}

//component for displaying all the catgrams in the database
const GramList = (props) => {
  //show the comment menu when the comment buttons is clicked
  const handleCommentClick = (e, _id) => {
    const commentsMenu = document.getElementById("commentsMenu");
    commentsMenu.classList.remove('hidden');

    loadCommentsFromServer(_id);
  }

  if(props.grams.length === 0){
    return (
      <div className="gramList">
        <h2 className="emptyGram"><b>No CatGrams Yet!</b></h2>
      </div>
    )
  }

  const gramNodes = props.grams.reverse().map(gram => {
    let url = `/retrieveGram?_id=${gram._id}`;
    if(gram.comments.length){

    }

    if (gram.mimetype === 'video/mp4') {
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
                <video controls>
                  <source src={url} type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
              </figure>
            </div>
            <div>         
               <LikeButton likes={gram.likes} _id={gram._id}/>
               <button className="commentButton" onClick={ (e) => handleCommentClick(e, gram._id) }>
                <span className="comments-counter"  _id={gram._id}>{ `Comments | ${gram.comments.length}` }</span>
               </button>
            </div>
        </div>
      )      
    }
    
    else if(gram.mimetype === 'image/png' || gram.mimetype === 'image/jpeg' || gram.mimetype === 'image/gif'){
      return (
        <div class="gram" key={gram._id}>
            <h2 className="username">
              {gram.user}
            </h2>
            <div className="textContent">
              {gram.text}
            </div>
            <img src={url} alt="A Catgram"/>
            <div>         
              <LikeButton likes={gram.likes} _id={gram._id}/>
              <button className="commentButton" onClick={ (e) => handleCommentClick(e, gram._id) }>
                <span className="comments-counter"  _id={gram._id}>{ `Comments | ${gram.comments.length}` }</span>
              </button>
            </div>
        </div>
      )
    }})
  

  return (
    <div className="gramList">
      {gramNodes}
    </div>
  )
}

//Button component for a like button
//credit for code https://stackoverflow.com/questions/72153851/create-a-simple-like-button-component-with-react
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

//a get request to get all the catgrams in the server and pass it into 
//the GramList compenent to load it in to the client
const loadGramsFromServer = async () => {
  const response = await fetch('/getGrams');
  const data = await response.json();
  ReactDOM.render(
    <GramList grams={data.grams} />,
    document.getElementById('catGrams')
  );
}

//a get request to get all the comments on a specific catgram
const loadCommentsFromServer = async (_id) => {
  const response = await fetch(`/getComments?_id=${_id}`);
  const data = await response.json();

  ReactDOM.render(
    <CommentList comments={data.comments} _id={data._id}/>,
    document.getElementById('commentContent')
  );
}

const init = () => {
  isLoggedIn();

  ReactDOM.render(
    <GramList grams={[]} />,
    document.getElementById ('catGrams')
  );

  loadGramsFromServer();

  const closeButton = document.getElementById("closeComment");
  const commentsMenu = document.getElementById("commentsMenu");

  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    commentsMenu.classList.add('hidden');
    return false;
  })
}

window.onload = init; 