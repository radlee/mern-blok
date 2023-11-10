import postImg from './kinetic-kudu-ubuntu-download-406x232.jpg'
 
export default function Post() {
    return(
        <div className="post">
            <div className="image">
            <img src={postImg} alt="" ></img>
            </div>
            <div className="texts">
            <h2>[ House ]: Rent to Own Property</h2>
            <p className="info">
                <a href='/' className="author">Lolito Mafanga</a>
                <time>2023-11-10 15:52</time>
            </p>
            <p>Available place to rent tuntil you own it. Call us
            on the number below to help you get started.
            </p>
            </div>
      </div>
    )
}