import React, {useState} from 'react';
import {Button, TextField, GridList, GridListTile, GridListTileBar, ListSubheader, IconButton} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./App.css"
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
const client = axios.create();

const useStyles = makeStyles((theme) =>
({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,

    },
    gridList: {
        width: 500,
        height: 450,

    },
    titleBar : {
        width: 100,
        margin: "auto",
        background: 'rgba(0, 0, 0, 0.5)',
    }
}));

function App() {
    const [imagetext, setimagetext] = useState('');
    const [imageurl, setimageurl] = useState('');
    const [startdate, setstartdate] = useState(new Date());
    const [enddate, setenddate] = useState(new Date());
    const [tileData, settile] = useState([]);


    const onChangeText = e =>
    {
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

    const viewDate=()=>
    {
        client.post('http://localhost:3001/view', {startdate: moment(startdate).format('YYYYMMDD'), enddate: moment(enddate).format('YYYYMMDD')})
            .then(function(response)
                {
                    settile(response.data)
                    console.log(response)
                    console.log(tileData.length)
                })
            .catch(error => {console.log('error : ', error.response)})
    }

    const classes = useStyles();



    //{
        //img: '',
        //title: '',
        //https://picsum.photos/id/1018/1000/600/
    //},

    return (
    <div className="App">
        <div className="App-header">
            <img src = {imageurl.uri}/>
            <TextField label = "Image Name" value = {imagetext} onChange={onChangeText}/>
            <Button className = "btnStyle" variant="contained" color = "primary" onClick={viewPhoto}>Click Me!</Button>
            <DatePicker dateFormat="yyyy/MM/dd" selected={startdate} onChange={date => setstartdate(date)} />
            <DatePicker dateFormat="yyyy/MM/dd" selected={enddate} onChange={date => setenddate(date)}/>
            <Button className = "btnStyle" variant="contained" color = "primary" onClick={viewDate}>Click Me!</Button>

            <div className={classes.root}>
                <GridList cellHeight={180} className={classes.gridList} cols={1}>
                    <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Photo List</ListSubheader>
                    </GridListTile>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.img}>
                            <img src={tile.img} alt={tile.title} />
                            <GridListTileBar
                                className= {classes.titleBar}
                                title={tile.title}
                                subtitle={<span>date: {tile.date}</span>}
                            />

                        </GridListTile>
                    ))}
                </GridList>
            </div>

        </div>

    </div>
  );
}

export default App;
