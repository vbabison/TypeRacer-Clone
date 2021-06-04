import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import texts from '../components/race/getText.js';

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
  const classes = useStyles();
  const text1 = "We must be willing to let go of the life we have planned, so as to have the life that is waiting for us. Life is a dream for the wise, a game for the fool, a comedy for the rich, a tragedy for the poor."

  const text2 = "Never be bullied into silence. Never allow yourself to be made a victim. Accept no one's definition of your life; define yourself."

  const text3 = "Life is what happens while you are busy making other plans. you can't do is ignore them. Because they change things. They push the human race forward. And Sometimes life hits you in the head with a brick. Don't lose faith. We do not remember days, we remember moments."

  const text4 = "The truth is you don't know what is going to happen tomorrow. Life is a crazy ride, and nothing is guaranteed. He who has a why to live can bear almost any how."

  const text5 = "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less."

  const text6 = "Be thankful for what you have; you'll end up having more. If you concentrate on what you don't have, you will never, ever have enough. I decided I can’t pay a person to rewind time, so I may as well get over it."

  const text7 = "It needs to be said and heard: it's OK to be who you are. I think it's great to be flawed. I am hugely flawed, and I like it this way. That's the fun of life. You fall, get up, make mistakes, learn from them, be human and be you."

  const text8 = "I'll never forget where I'm from. It's essential to remain humble and evolving. If you’re doing something outside of dominant culture, there’s not an easy place for you. You will have to do it yourself."

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text1}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text2}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text3}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text4}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text5}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text6}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text7}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={3} className={classes.row}>
          <React.Fragment>
            <Grid item xs={6}>
              <Paper className={classes.paper}>{text8}</Paper>
            </Grid>
          </React.Fragment>
        </Grid>
      </Grid>
    </div>
  );
}
