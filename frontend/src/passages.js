import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import texts from './components/race/getText.js';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function Passages() {
  const [stats, setStats] = useState([])
  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/passages'
    }).then (res => {
      console.log(res.data.data)
      setStats(res.data.data)
    })
  }, []);
  const classes = useStyles();

  function handleClick(e) {
    e.preventDefault();
    console.log(stats.map((row) => (row.string)));
  }
  
  return (
    <div className={classes.root}>
      {stats.map((row) => (
      <Grid onClick={handleClick} container spacing={1}>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{row.string}</Paper>
            </Grid>
          </React.Fragment>
        </Grid> 
      </Grid>
      ))}
    </div>
  );
}
