import React from 'react';
import PropTypes from 'prop-types';
import * as postsApi from '../api/posts';
import Post from './Post';

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
        this.setState({ posts });
      })
      .catch(() => {});
  }

  handleSavePost() {
    postsApi.savePost(this.props.userId, this.postTextInput.current.value)
      .then((savedPost) => {
        this.postTextInput.current.value = '';
        const posts = [savedPost, ...this.state.posts];
        this.setState({ posts });
      });
  }

  handleEditPost(postId, newText) {
    postsApi.editPost(this.props.userId, postId, newText)
      // eslint-disable-next-line no-console
      .then(() => {
        const posts = [...this.state.posts];
        const post = posts.filter((p) => p.id === postId);
        debugger
        post[0].post = newText;
        this.setState({ posts });
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert('an error ocurred');
      });
  }

  handleDeletePost(postId) {
    postsApi.deletePost(this.props.userId, postId)
      .then(() => {
        const posts = this.state.posts.filter((p) => p.id !== postId);
        this.setState({ posts });
      });
  }

  renderPosts() {
    const nodes = this.state.posts.reduce((nodeArr, p) => {
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
    return nodes;
  }

  render() {
    return (
      <div className='page'>
        <div className='card--borderless'>
          <div id='profile-head' className='flex'>
            <div className='flex-item--shrink'>
              <img className='img--thumbnail'
              src="https://scontent-bos3-1.xx.fbcdn.net/v/t1.0-9/39992261_1780642188639098_3104100502657302528_n.jpg?_nc_cat=103&_nc_sid=85a577&_nc_ohc=PeMsRB9nnxwAX_kIRHZ&_nc_ht=scontent-bos3-1.xx&oh=898a95c20b993199c04c7a53325f3f5c&oe=5ED4FF45"
              alt='your fase' />
            </div>
            <div className='flex-item'>
              <h1>Cristian Castro</h1>
              <span className="display--block">Joined 2001</span>
              <p className="display--block text--muted">Azul, hoy miro al cielo y en ti puedo ver
                La estrella que siempre soñé</p>
            </div>
          </div>
        </div>
      { this.props.isOwner &&
          <div className='flex--column centered'>
            <div className='card--bounded flex--column'>
              <textarea
                ref={this.postTextInput}
                name='postContent'
                placeholder='Que quieres compartir?'
                className='margin--bottom flex-item'
                onChange={(e) => this.setState({ enablePost: !!e.target.value.trim() })}></textarea>
              <button
                className='button flex-item align--right'
                disabled={!this.state.enablePost}
                onClick={this.handleSavePost}>POST</button>
            </div>
          </div>
        }
        <div className='flex--column centered'>
          {this.renderPosts()}
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  userId: PropTypes.string,
  isOwner: PropTypes.bool
};
