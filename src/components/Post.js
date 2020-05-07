import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/formatters';

const Post = (props) =>
  (<div className='card flex flex--column'>
    <div className='flex-item text--muted'>{formatDate(props.postedDate)}</div>
    <div>{props.post}</div>

    { props.isEditable &&
      <div className='flex-item align--right'>
        <button className="link--controls" onClick={() => props.onEdit(props.id, 'somememme')}>Editar</button>
        <button className="link--controls" onClick={() => props.onDelete(props.id)}>Eliminar</button>
      </div>
    }
  </div>);

Post.propTypes = {
  id: PropTypes.string.isRequired,
  post: PropTypes.string,
  postedDate: PropTypes.string,
  isEditable: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default Post;
