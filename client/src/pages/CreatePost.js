import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Editor from '../Editor';
import { BASE_URL } from '../helper';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setDirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    console.log(files);
    console.log(content);
    const response = await fetch(`${BASE_URL}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include'
    })
    if (response.ok) {
          setDirect(true);
        };
    }
    if(redirect) {
      return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={createNewPost}>
            <input  type="title" 
                    placeholder={'Title'}
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}

            />
            <input  type="summary" 
                    placeholder={'Summary'}
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)}
            />
            <input  type="file"
                    onChange={ev => setFiles(ev.target.files)}
            />
            <Editor onChange={setContent} value={content} />
            <button style={{marginTop: '5px'}}>Create Post</button>
        </form>
    )
}