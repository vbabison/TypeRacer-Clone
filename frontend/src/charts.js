import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(number, speed, when, user) {
  return { number, speed, when, user };
}

const rows = [
  createData('1', 298, '2021/06/8', 'John'),
  createData('2', 285, '2021/06/8', 'Steve'),
  createData('3', 279, '2021/06/8', 'April'),
  createData('4', 276, '2021/06/8', 'Kevin'),
  createData('5', 226, '2021/06/8', 'Bobby'),
];

export default function Charts() {
  const [stats, setStats] = useState([])
  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/charts'
    }).then (res => {
      console.log(res.data.data)
      setStats(res.data.data)
    })
  }, []);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="right">Speed</TableCell>
            <TableCell align="right">When</TableCell>
            <TableCell align="right">	User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.wpm}</TableCell>
              <TableCell align="right">{row.when}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}