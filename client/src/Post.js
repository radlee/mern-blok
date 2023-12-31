import { Link } from 'react-router-dom';
import {format} from 'date-fns';
import { BASE_URL } from './helper';
 
export default function Post({_id, title, summary, cover, content, createdAt, author}) {
    return(
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`${BASE_URL}/`+cover} alt="" ></img>
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
            <p className="info">
                <a href='/' className="author">{author.username} -</a>
                <time>{ format(new Date(createdAt), 'MMM d, yyy HH:mm:ss ')}</time>
            </p>
            <p className='summary'>{summary}</p>
            </div>
      </div>
    )
}