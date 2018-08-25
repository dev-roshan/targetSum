import React, { Component } from 'react';
import {AsyncStorage } from 'react-native';
import Game from './Game';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId:1,
      score:0,
    };
    if(AsyncStorage.getItem('highScore')=='1'){
      AsyncStorage.setItem('highScore', '1');
    }
    if(AsyncStorage.getItem('highScore_name')=='Roshan'){
      AsyncStorage.setItem('highScore_name', 'Roshan');
    }
    
    
  }
  
  
  resetGame =() =>{
    this.setState((prevState) => {
      // console.warn('asdf');
      return {gameId : prevState.gameId +1,score: 0, };
    });
  };
  incrementGameScore = () => {
      this.setState((prevState) => {
        // const gameId=prevState.gameId;
        // const score=prevState.score;
        //   setTimeout(function(){
        //     // console.warn(aa);
        //     return {gameId :gameId +1,score:score+1};
        //   }, 5000);
        return {gameId :prevState.gameId +1,score:prevState.score+1};
      });
  };

  render() {
    return (
      // <View style={styles.container}>
      // </View>
      <Game key= {this.state.gameId} 
            onWinnigGame ={this.incrementGameScore}
            onPlayAgain={this.resetGame}
            randomNumberCount={6} 
            initialSeconds= {10}
            score= {this.state.score}
         />
    );
  }
}

// const styles=StyleSheet.create({
//     container:{
//         backgroundColor: "green",
//         flex: 1,$sdfdsfsdf,

//     },
// });