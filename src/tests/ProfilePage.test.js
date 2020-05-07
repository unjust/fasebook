import React from 'react';
import TestRenderer from 'react-test-renderer';
import ProfilePage from '../components/ProfilePage';
import * as postsApi from '../api/posts';


describe('ProfilePage testRenderer', () => {

  jest.mock('../api/posts');
  const props = {
    userId: 'axifg345',
    isOwner: true
  };

  let testRenderer;

  it('renders the testRenderer that matches the snapshot', () => {
    testRenderer = TestRenderer.create(
      <ProfilePage {...props} />
    );
    const tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('getPosts and render', () => {
    it('calls getPosts on mount', (done) => {
      postsApi.getPosts = jest.fn(() =>
        new Promise((resolve) => {
          process.nextTick(() => resolve([]));
        }));
      TestRenderer.create(
        <ProfilePage {...props} />
      );
      expect(postsApi.getPosts).toHaveBeenCalledWith(props.userId);
      done();
    });

    it('calls renderPosts', (done) => {
      const renderPostsSpy = jest.spyOn(ProfilePage.prototype, 'renderPosts');
      TestRenderer.create(<ProfilePage {...props} />);
      expect(renderPostsSpy).toHaveBeenCalled();
      done();
    });
  });

  describe('handlers call appropriate apis', () => {
    it('calls savePost on handleSavePost', (done) => {
      const inputValue = 'blahblah';
      const savePostSpy = jest.spyOn(postsApi, 'savePost');

      testRenderer = TestRenderer.create(
        <ProfilePage {...props} />,
        {
          createNodeMock: (element) => {
            if (element.type === 'textarea') {
              return { value: inputValue };
            }
            return null;
          }
        }
      );

      testRenderer.root.instance.handleSavePost();
      expect(savePostSpy).toHaveBeenCalledWith(props.userId, inputValue);
      done();
    });

    it('calls editPost on handleEditPost', () => {
      const postId = '100001';
      const text = 'test text';
      const editPostSpy = jest.spyOn(postsApi, 'editPost').mockImplementation(() => Promise.resolve());
      testRenderer = TestRenderer.create(<ProfilePage {...props} />);
      testRenderer.root.instance.handleEditPost(postId, text);
      expect(editPostSpy).toHaveBeenCalledWith(props.userId, postId, text);
    });

    it('calls deletePost on handleDeletePost', () => {
      const postId = '100001';
      const deletePostSpy = jest.spyOn(postsApi, 'deletePost').mockImplementation(() => Promise.resolve());
      testRenderer = TestRenderer.create(<ProfilePage {...props} />);
      testRenderer.root.instance.handleDeletePost(postId);
      expect(deletePostSpy).toHaveBeenCalledWith(props.userId, postId);
    });
  });
});
