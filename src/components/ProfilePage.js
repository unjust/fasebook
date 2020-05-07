import React from 'react';
import * as postsApi from '../api/posts';
import Post from './Post';
import '../scss/profilePage.scss';

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.postTextInput = React.createRef();
    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.state = { posts: [] };
  }

  componentDidMount() {
    // call api for current posts
    postsApi.getPosts(this.props.userId)
      .then((posts) => {
        this.setState({ posts })
      });
  }

  handleSavePost() {
    postsApi.savePost(this.props.userId, this.postTextInput.current.value)
      .then((savedPost) => {
        this.postTextInput.current.value = '';
        const posts = [savedPost, ...this.state.posts];
        this.setState({ posts });
      })
      .catch(() => {
        alert('an error ocurred');
      });
  }

  handleEditPost(postId, newText) {
    postsApi.editPost(this.props.userId, postId, newText)
      .then()
      .catch(() => {
        alert('an error ocurred');
      });
  }

  handleDeletePost(postId) {
    postsApi.deletePost(this.props.userId, postId)
      .then(() => {
        const posts = this.state.posts.filter((p) => p.id !== postId);
        this.setState({ posts });
      })
      .catch(() => {
        alert('an error ocurred');
      });
  }
  
  renderPosts() {
    const nodes = this.state.posts.reduce((nodeArr, p, i) => {
      nodeArr.push(
        <Post 
          {...p}
          key={p.id}
          isEditable={this.props.isOwner || undefined}
          onEdit={this.handleEditPost}
          onDelete={this.handleDeletePost} />
      );
      return nodeArr;
    }, []);
    return <div>{nodes}</div>
  }

  render() {
    return (
      <div>
        <div className='card'>
          <div id='profile-head' className='flex'>
            <div className='flex-item--shrink'>
              <img className='img--thumbnail' 
              src="https://scontent-bos3-1.xx.fbcdn.net/v/t1.0-9/39992261_1780642188639098_3104100502657302528_n.jpg?_nc_cat=103&_nc_sid=85a577&_nc_ohc=PeMsRB9nnxwAX_kIRHZ&_nc_ht=scontent-bos3-1.xx&oh=898a95c20b993199c04c7a53325f3f5c&oe=5ED4FF45"
              alt='your fase' />
            </div>
            <h1 className='flex-item'>CRISTIAN CASTRO</h1>
          </div>
        </div>
       <div className='card flex--column'>
          <textarea 
            ref={this.postTextInput}
            name='postContent'
            placeholder='Que quieres compartir?'
            className='margin--bottom'></textarea>
          <button 
            className='align--right' 
            onClick={this.handleSavePost}>POST</button>
        </div>
        {this.renderPosts()}
      </div>
    )
  }
}
