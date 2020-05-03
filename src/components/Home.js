import React from 'react';
import { getPosts, savePost } from '../api/posts'

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.postTextInput = React.createRef();
    this.handleSavePost = this.handleSavePost.bind(this);
    this.state = { posts: [] };
  }

  componentDidMount() {
    // call api for current posts
    getPosts(this.props.userId)
      .then((posts) => this.setState({ posts }));
  }

  handleSavePost() {
    savePost(this.props.userId, this.postTextInput.current.value);
  }

  render() {
    return (
      <div>
        <h1>I'm home!</h1>
        <div>
          <textarea 
          ref={this.postTextInput}
          name='postContent'
          placeholder='que quieres compartir?'></textarea>
        </div>
        <button onClick={this.handleSavePost}>DUMMY POST</button>
      </div>
    )
  }
}
