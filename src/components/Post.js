import React from 'react';
import { formatDate } from '../utils/formatters';

const Post = (props) => 
  (<div className='card flex flex--column'>
    <div className='flex-item text--muted'>{formatDate(props.postedDate)}</div>
    <div>{props.post}</div>

    { props.isEditable &&
      <div className='flex-item align--right'>
        <button className="link--controls" onClick={() => props.onEdit(props._id, 'somememme')}>Editar</button>
        <button className="link--controls" onClick={() => props.onDelete(props._id)}>Eliminar</button>
      </div>
    }
  </div>)

export default Post;
