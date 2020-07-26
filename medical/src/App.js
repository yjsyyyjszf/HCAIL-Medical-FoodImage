import React, {useState} from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import "./App.css"

import axios from 'axios'
const client = axios.create();

function App() {
    const [imagetext, setimagetext] = useState('');
    const [imageurl, setimageurl] = useState('');

    const onChangeText = e => {
        setimagetext(e.target.value)
    }

    const viewPhoto=()=>
        {
            client.get('http://localhost:3001/show/'+imagetext)
                .then((response)=>
                {
                    return response;
                })
                .then((photo)=>
                {
                    let url = {uri : ("data:image/jpg;base64," + photo.data)};
                    return url
                })
                .then((url)=>
                {
                    setimageurl(url)
                    console.log(url)

                })
                .catch((err) => {console.log(err)})

        }

    return (
    <div className="App">
        <div className="App-header">
            <img src = {imageurl.uri}/>
            <TextField label = "Image Name" value = {imagetext} onChange={onChangeText}/>
            <Button className = "btnStyle" variant="contained" color = "primary" onClick={viewPhoto}>Click Me!</Button>

        </div>

    </div>
  );
}

export default App;
