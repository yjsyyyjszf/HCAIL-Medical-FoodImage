import React, {useState} from 'react';
import {Button, TextField, GridList, GridListTile, GridListTileBar, ListSubheader, ListItem, ListItemText} from '@material-ui/core'
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
        width: "auto",
        height: "auto",

    },
    titleBar : {
        width: "auto",
        margin: "auto",
        background: 'rgba(0, 0, 0, 0.5)',
    }
}));


function App() {
    const [imagetext, setimagetext] = useState('');
    const [startdate, setstartdate] = useState(new Date());
    const [enddate, setenddate] = useState(new Date());
    const [tileData, settile] = useState([]);
    const [dataSet, setdataset] = useState([]);
    const [comment, setcomment] = useState('');


    const onChangeText = e =>
    {
        setimagetext(e.target.value)
    }

    const onChangeComment = e =>
    {
        setcomment(e.target.value)
    }

    const sendComment=(imgname)=>
    {
        client.post('/sendcomment', {name: imgname, comment: comment})
            .then((response)=>
            {
                console.log("GOOD")
            })
            .catch((err)=>{console.log(err)})
    }


    const viewPhoto=(imgname)=>
    {
        client.post('/name', {name: imgname})
            .then((response)=>
            {
                settile(response.data)
                console.log(response)
            })
            .catch((err) => {console.log(err)})
    }

    const viewDate=()=>
    {
        client.post('/date', {startdate: moment(startdate).format('YYYYMMDD'), enddate: moment(enddate).format('YYYYMMDD')})
            .then(function(response)
            {
                settile(response.data)
                console.log(response)
                console.log(tileData.length)
            })
            .catch(error => {console.log('error : ', error.response)})
    }

    const getList=()=>
    {
        client.get('/get',)
            .then((response)=>
            {
                setdataset(response.data)
                console.log(dataSet)
            })
            .catch(error => {console.log('error : ', error.response)})
    }


    const classes = useStyles();

    return (
    <div className="App">
        <div className="App-header">
            <div className="setBox">
                <div className="nameStyle">
                    <TextField label = "Image Name" value = {imagetext} onChange={onChangeText}/>
                    <Button className = "btnStyle" variant="contained" color = "primary" onClick={()=>viewPhoto(imagetext)}>Click</Button>
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
                <div>
                    <div className={classes.root}>
                        <ListItem button key="list" onClick={getList}>
                            <ListItemText primary={"VIEW"}/>
                        </ListItem>
                        {dataSet.map((data)=>
                            (
                                <ListItem button key={data.name} onClick={()=>viewPhoto(data.name)}>
                                    <ListItemText primary={data.name} secondary={data.date}/>
                                </ListItem>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="imageBox">
                <div className={classes.root}>
                    <GridList cellHeight='auto' className={classes.gridList} cols={1}>
                        <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
                            <ListSubheader component="div">Photo List</ListSubheader>
                        </GridListTile>
                        <div>
                            {tileData.map((tile) => (
                                <div>
                                    <GridListTile key={tile.img}>
                                        <img src={tile.img} alt={tile.title} />
                                        <GridListTileBar
                                            className= {classes.titleBar}
                                            title={tile.title}
                                            subtitle={<span>date: {tile.date}</span>}
                                        />
                                    </GridListTile>
                                    <div>
                                        <ListItem button onClick={()=>sendComment(tile.title)} style={{backgroundColor: 'green'}}>
                                            <ListItemText primary={"Send"} style={{color: 'white'}} />
                                        </ListItem>
                                        <TextField
                                            id="outlined-multiline-static"
                                            multiline
                                            rows={4}
                                            defaultValue="Default Value"
                                            style={{ margin: 8, height: 'auto' }}
                                            variant="outlined"
                                            fullWidth
                                            onChange={onChangeComment}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GridList>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
