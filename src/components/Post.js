import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/formatters';

const dummyEdit = 'Lo siento, no tuve tiempo para cumplir este parte. Pero podemos hablar de esto.';

const Post = (props) =>
  (<div className='card--bounded flex--column'>
    <div className='flex-item text--date'>{formatDate(props.postedDate)}</div>
    <div>{props.post}</div>

    { props.isEditable &&
      <div className='flex-item align--right'>
        <button className="link--controls" onClick={() => props.onEdit(props.id, dummyEdit)}>Editar</button>
        <button className="link--controls" onClick={() => props.onDelete(props.id)}>Eliminar</button>
      </div>
    }
  </div>);

Post.propTypes = {
  id: PropTypes.string.isRequired,
  post: PropTypes.string,
  postedDate: PropTypes.number,
  isEditable: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default Post;
