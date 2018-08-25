import React, { Component } from 'react';
import PropTypes from 'prop-types'; 

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';

import { AsyncStorage,TouchableOpacity, View, Text, StyleSheet ,StatusBar, Button } from 'react-native';

import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';
import Modal from "react-native-modal";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedIds:[],
        remainingSeconds: this.props.initialSeconds,
        score :this.props.score,
        visibleModal: null,
        highScore: 0,
        highScorer : '',
        is_latest_highscorer: false,
    };
    
  };

//   toggle function
// _toggleModal = () =>
//   this.setState({ isModalVisible: !this.state.isModalVisible });
renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Genius</Text>
    {this.renderButton("Next", 
        (() => {
            this.setState({ visibleModal: null });
            this.props.onWinnigGame();
            })
        )}
    </View>
  );
  renderModalContent2 = () => (
    <View style={styles.modalContent}>
      <Text>No not correct</Text>
    {this.renderButton("Play Again", 
        (() => {
            this.setState({ visibleModal: null });
            this.props.onPlayAgain();
            })
        )}
    </View>
  );

  renderModalContent3 = () => (
    <View style={styles.modalContent}>
      <Text>Oh Crap Times up</Text>
    {this.renderButton("Play Again", 
        (() => {
            this.setState({ visibleModal: null });
            this.props.onPlayAgain();
            })
        )}
    </View>
  );
  renderModalContent4 = () => (
    <View style={styles.modalContent}>
      <Text>You are the Champion Give your name</Text>
      <Input
        placeholder='Enter Name Here'
        leftIcon={
            <Icon
            name='user'
            size={24}
            color='black'
            />
        }
        maxLength= {7}
             style = {styles.inputBoxChampion}
             onChangeText={(changedText) => this.state.highScorer=changedText}
        />
      {/* <TextInput 
             maxLength= {7}
             style = {styles.inputBoxChampion}
             onChangeText={(changedText) => this.state.highScorer=changedText} /> */}

    {this.renderButton("Play Again", 
        (() => {
            this.setState({ visibleModal: null });
            AsyncStorage.removeItem('highScore_name');
            AsyncStorage.setItem('highScore_name',this.state.highScorer);
            this.props.onPlayAgain();
            })
        )}
    </View>
  );

createHighScore = async (score) => {
    try {
        const highScore = await AsyncStorage.getItem('highScore');
        const highScorer_name = await AsyncStorage.getItem('highScore_name');
        this.state.highScorer=highScorer_name;
    //   const score = await AsyncStorage.getItem('score');
      //Fix this. Now your highscore should be the score
    //   console.warn(score < Number(highScore));
    // console.warn(score,highScore);
      if (score <= Number(highScore)) {
        //   console.warn(score);
        this.setState({ highScore: Number(highScore) });
      }
      else{
        //   console.warn(score);
        this.setState({ highScore: Number(score) });
        AsyncStorage.removeItem('highScore');
        AsyncStorage.setItem('highScore',String(score));
        if(!this.state.is_latest_highscorer){
            this.state.is_latest_highscorer=true; 
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

componentDidMount() {
    StatusBar.setHidden(true);
   this.intervalID= setInterval(() => {
                this.setState((prevState) =>{
                    return { remainingSeconds : prevState.remainingSeconds -1 };
                }, () =>{
                    if(this.state.remainingSeconds === 0){
                        clearInterval(this.intervalID);
                    }
                });
            }, 1000);
 };
 componentWillMount(){
    clearInterval(this.intervalID);
    this.createHighScore(this.state.score);
 };
 componentWillUpdate = (nextProps, nextState) => {
   if(nextState.selectedIds!==this.state.selectedIds || nextState.remainingSeconds===0)
   {
       this.gameStatus =this.calcgameStatus(nextState);
       if(this.gameStatus !='Playing'){
           clearInterval(this.intervalID);
       } 
       if(this.gameStatus =='Won'){
        // console.warn('asdfsdf');
        //    this.props.onWinnigGame();
        // this._toggleModal();
        this.createHighScore(this.state.score);
        if(this.state.visibleModal!=1){
            this.setState({ visibleModal: 1 });
        }
       }
       if(this.gameStatus=='Lost'){
        //    console.warn(this.state.is_latest_highscorer);
           if(this.state.is_latest_highscorer){
            if(this.state.visibleModal!=4){
                this.setState({ visibleModal: 4 });
                this.setState.is_latest_highscorer=false;
           }
           
           }
           if(this.state.remainingSeconds === 0 && !this.state.is_latest_highscorer){
            if(this.state.visibleModal!=3){
                 this.setState({ visibleModal: 3 });
            }
           }
           else
           {
            if(this.state.visibleModal!=2 && !this.state.is_latest_highscorer){
                this.setState({ visibleModal: 2 });
           }
        }
       }

    }
 };
 

static propTypes={
    initialSeconds: PropTypes.number.isRequired,
    randomNumberCount: PropTypes.number.isRequired,
    onPlayAgain:PropTypes.func.isRequired,
    onWinnigGame:PropTypes.func.isRequired,
    score : PropTypes.number.isRequired,
};
gameStatus= 'Playing';
// target=10 + Math.floor(40 * Math.random());
randomNumbers=Array
    .from({ length:this.props.randomNumberCount })
    .map(()=> 1 + Math.floor(10 * Math.random()));
target=this.randomNumbers
    .slice(0,this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
shuffledRandomNumbers = shuffle(this.randomNumbers);

isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
};
selectNumber= (numberIndex)=>{
    this.setState((prevState) => ({
        selectedIds: [...prevState.selectedIds,numberIndex],
    }));
};
// gameStatus :Playing, Won ,Lost
calcgameStatus = (nextState) =>{
    const sumSelected= nextState.selectedIds.reduce((acc, curr) => {
        return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if(nextState.remainingSeconds ===0){
        this.state.remainingSeconds = 0;
        return 'Lost';
    }
    if(sumSelected < this.target){
        return 'Playing';
    }
    if(sumSelected === this.target){
        return 'Won';
    }
    if(sumSelected > this.target){
        return 'Lost';
    }
};

  render() {
      const gameStatus =this.gameStatus;
    return (
      <View style={styles.container}>
      <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>👍👉{this.target}👈👍</Text>
      <Text style={styles.score}>Score : {this.state.score}</Text>
      <Text style={styles.remaingTime}>{this.state.remainingSeconds}</Text>
        <Text style={styles.status}>{gameStatus}</Text> 
        <View style={styles.randomContainer}>
            {this.shuffledRandomNumbers.map((randomNumber, index) =>
                <RandomNumber 
                    key={index} 
                    id={index}
                    number={randomNumber} 
                    isDisabled={this.isNumberSelected(index) || gameStatus != 'Playing'}
                    onPress={this.selectNumber}
                />
                // <Text style={styles.random} key={index}>{randomNumber}</Text>
                )}
        </View>
        <View style={styles.highScoreTab}>
            <Text style={styles.highScore}>Highscore :{this.state.highScorer} - {this.state.highScore}</Text>
            {/* <Text style={styles.highScoreName}> </Text> */}
        </View>
      
        <Modal
          style={styles.modal}
          isVisible={this.state.visibleModal === 1}
        //   backdropColor={"green"}
        //   backdropOpacity={20}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
        {this.renderModalContent()}

        </Modal>
        <Modal
          style={styles.modal}
          isVisible={this.state.visibleModal === 2}
        //   backdropColor={"green"}
        //   backdropOpacity={20}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
        {this.renderModalContent2()}

        </Modal>
        <Modal
          style={styles.modal}
          isVisible={this.state.visibleModal === 3}
        //   backdropColor={"green"}
        //   backdropOpacity={20}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
        {this.renderModalContent3()}

        </Modal>
        <Modal
          style={styles.modal}
          isVisible={this.state.visibleModal === 4}
        //   backdropColor={"green"}
        //   backdropOpacity={20}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
        {this.renderModalContent4()}

        </Modal>
      </View>
    );
  }
}

const styles=StyleSheet.create({
    container:{
        backgroundColor: "#2D6886",
        flex: 1,
    },
    target:{
        fontSize: 50,
        backgroundColor: '#772863',
        margin: 20,
        textAlign:'center',
        borderWidth:10,
        borderColor:'#C4C2EB',
        color:'#C4C2EB',
    },
    randomContainer: {
        flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'space-around',
    },
    gamestatus:{
        backgroundColor:'white',
        textAlign:'center',
        fontSize:20,
        fontWeight: 'bold',
    },
    STATUS_Playing :{
        backgroundColor:'#772863', 
    },
    STATUS_Won :{
        backgroundColor:'green',
    },
    STATUS_Lost :{
        backgroundColor: 'red',
    },
    remaingTime:{
        color: 'white',
        fontSize: 25,
        textAlign:'center',
        justifyContent:'center',
        marginTop: -20,
    },
    status:{
        textAlign:'center',
        justifyContent:'center',
        color:'white',
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
      modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
      bottomModal: {
        justifyContent: "flex-end",
        margin: 0
      },
      modal:{
      backgroundColor:  '#ffffff00',
      marginBottom: -20,
      flex:1
      },
      
      score: {
        color:'white',
        marginLeft: 30,
        fontSize:20,
        fontWeight:'bold',
      },
      highScoreTab:{
          justifyContent:'center',
          flexDirection: 'row',
          marginTop:-10,
          backgroundColor:'#6EC95E',
      },
      highScore:{
        color:'white',
        fontSize:20,
        fontWeight:'bold',
        
     },
      highScoreName:{
        fontSize:20,
        fontWeight:'bold',
        color:'white',
      },
      inputBoxChampion:{
          borderWidth:3,
          borderRadius:10,
          borderColor:'green',
      }
});