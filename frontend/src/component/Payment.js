import React, {useState} from 'react';

import styled from 'styled-components';
import {darken, lighten} from 'polished'
import {Redirect, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import OrderNumCheck from './OrderNumCheck';

const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
`;

const DialogBlock = styled.div`
  width: 500px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  

  h3 {
    margin: 0;
    padding-top: 1.3rem;
    font-size: 2rem;
    display:flex;
    align-items:center;
    justify-content:center;
  }
`;

const useStyles = makeStyles({
  root: {
    width: '80%',
    display:"flex",
    justifyContent:'center',
    alignItems:'center',
    padding:"50px",
    
    
  },
});

function LinearDeterminate({setDone,data,setVisible}) {
  const history = useHistory()
  const classes = useStyles();
  const [progress, setProgress] = React.useState(1);
  // 카드 관련 팝업 진행 바 함수
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        else if (oldProgress != 0){
          const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
        }
      });
    }, 300);
    // 진행바가 다 찰시 주문현황판으로 이동
    if (progress === 100){
      setVisible()
      history.push(`${data.category[0].categoryPk}/orderNum`)
    }
    // useEffct 클리어 하기 setInterval 그만 돌도록
    return () => {
      clearInterval(timer);
    };
  }, [progress]);
  return (
    <div className={classes.root}>
      <LinearProgress style ={{width:"100%", height:"30px" }} variant="determinate" value={progress} />
    </div>
  );
}

  

function Payment({ title, visible,children,orderNumber,data,setVisible  }) {
  if (!visible) return null;
  return (
    <DarkBackground>
      <DialogBlock>
        <h3>{children}</h3>
        <h3>{orderNumber}</h3>
        <LinearDeterminate data={data}  setVisible={setVisible}/>
      </DialogBlock>
    </DarkBackground>
  );
}



export default Payment;