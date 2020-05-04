import React from 'react';
import { getPosts, savePost, editPost } from '../api/posts'
import Post from './Post';
import '../scss/profilePage.scss';

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.postTextInput = React.createRef();
    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.dateFormatter = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short', day: 'numeric' });
    this.state = { posts: [] };
  }

  componentDidMount() {
    // call api for current posts
    getPosts(this.props.userId)
      .then((posts) => {
        posts.forEach((p) => {
          // const [{ value: m },,{ value: d },,{ value: y }] = this.dateFormatter.formatToParts(p.postedDated);
          // console.log(this.dateFormatter.formatToParts(p.postedDated));
          const date = this.dateFormatter.format(p.postedDated);
          p.formattedPostDate = date;
          return p;
        })
        this.setState({ posts })
      });
  }

  handleSavePost() {
    savePost(this.props.userId, this.postTextInput.current.value);
  }

  handleEditPost(postId, newText) {
    editPost(this.props.userId, postId, newText);
  }

  handleDeletePost() {

  }
  
  renderPosts() {
    const nodes = this.state.posts.reduce((nodeArr, p, i) => {
      nodeArr.push(
        <Post 
          {...p}
          key={p._id}
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
