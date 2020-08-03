import React, {useState} from 'react';
import {Button, TextField, GridList, GridListTile, GridListTileBar, ListSubheader} from '@material-ui/core'
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
        overflow: 'hidden',
        justifyContent: 'space-around',
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
    const [startdate, setstartdate] = useState(new Date());
    const [enddate, setenddate] = useState(new Date());
    const [tileData, settile] = useState([]);


    const onChangeText = e =>
    {
        setimagetext(e.target.value)
    }

    const viewPhoto=()=>
    {
        client.post('http://localhost:3001/show', {name: imagetext})
            .then((response)=>
            {
                settile(response.data)
                console.log(response)
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
            <div className="nameStyle">
                <TextField label = "Image Name" value = {imagetext} onChange={onChangeText}/>
                <Button className = "btnStyle" variant="contained" color = "primary" onClick={viewPhoto}>Click</Button>
            </div>
            <div className="dateBoxStyle">
                <div className="dateStyle">
                    Start Date
                    <DatePicker dateFormat="yyyy/MM/dd" selected={startdate} onChange={date => setstartdate(date)} />
                </div>
                <div className="dateStyle"> End Date
                    <DatePicker dateFormat="yyyy/MM/dd" selected={enddate} onChange={date => setenddate(date)}/>
                </div>
                <Button className = "btnStyle" variant="contained" color = "primary" onClick={viewDate}>Click</Button>
            </div>

            <div className={classes.root}>
                <GridList cellHeight='auto' className={classes.gridList} cols={1}>
                    <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Photo List</ListSubheader>
                    </GridListTile>
                    <div>
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
                    </div>
                </GridList>
            </div>

        </div>

    </div>
  );
}

export default App;
