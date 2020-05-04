import React from 'react';

const Post = (props) => 
  (<div className='card flex flex--column'>
    <div className='flex-item text--muted'>{props.formattedPostDate}</div>
    <div>{props.post}</div>

    { props.isEditable &&
      <div className='flex-item align--right'>
        <button className="link--controls" onClick={() => props.onEdit(props._id, 'somememme')}>Editar</button>
        <button className="link--controls" onClick={props.onDelete}>Eliminar</button>
      </div>
    }
  </div>)

export default Post;
