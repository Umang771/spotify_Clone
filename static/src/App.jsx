
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios';
import { useState,useEffect } from 'react';
import "./App.css"



const CLIENT_ID = "c3604c2a978a4fba9217bbee3c4d54fe"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

function App() {
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "track",
        limit:48
      }
    })
    console.log(data)
    setArtists(data.tracks.items)
  }
  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id} >
      <a href= {artist.uri} >
        {artist.album.images.length ? <img width={"100%"} src={artist.album.images[0].url} alt=""  /> : <div>No Image</div> } 
      <div className="name">{artist.name}</div>  
        </a>
      </div>
    ))
  }

  return (
    <div className="App">
      <div className='head'>
        <header className="App-header">
        <h1 >SPOTIFY ~ SONGS AND ALBUMS</h1>
        <div className='options'>
      <form onSubmit={searchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)} />
        <button type={"submit"}>Search</button>
      </form>
      {!token ?<a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Loginto Spotify</a>:<button onClick={logout}>Logout</button>}
      </div>
      </header>
      </div>
      {/* <InfiniteScroll> */}
      <div className='pictures' >
        {renderArtists()}
        </div>
        {/* </InfiniteScroll> */}
    </div>
  );
}

export default App;