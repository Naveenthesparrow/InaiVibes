import React from 'react'
import Header from '../components/Header'
import UserDetails from '../components/UserDetails'
import Videoplayer from '../components/Videoplayer'
import SearchBox from '../components/serachbox'
import { useState } from 'react'
function Room() {
    const [selectedVideoId, setSelectedVideoId] = useState("");
  return (
    <div>
        <Header/>
        <div className='flex'>
            <UserDetails/>
            <Videoplayer videoId={selectedVideoId}/>
            <SearchBox onVideoSelect={setSelectedVideoId}/>
        </div>
    </div>
  )
}

export default Room

// VITE_YOUTUBE_V3_KEY=AIzaSyB7azfn8DRhyimcv4cOmqd1Vl6biqRXyos
//     const API_KEY = import.meta.env.VITE_YOUTUBE_V3_KEY;