
import React, { Component } from 'react';
import Header from '../pages/headers/Header';
import {
  AlertIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,AsyncStorage
} from 'react-native';
import Toast from 'react-native-easy-toast';
import TouchID from "react-native-touch-id";

export default class FingerPrint extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Fingerprint Authentication',
      header:<View style={styles.header}>
      <Header navigation={navigation} />
      </View>
    };
  };
  constructor() {
    super()
    this.state = {
      biometryType: null,
      haveError: false,
    };
  }
  clickHandler = () => {
    TouchID.isSupported()
      .then(authenticate(this.props))
      .catch(error => {
        this.setState({haveError:true});
        this.toast.show('Touch ID is not supported');
        // AlertIOS.alert('TouchID not supported');
      }); 
  }

  componentDidMount() {
    TouchID.isSupported()
    .then(biometryType => {
      this.setState({ biometryType });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Toast 
          ref={toast => {
          this.toast = toast;
          }}
          position={'center'}
          position='top'
          style={ [{backgroundColor:this.state.haveError ?'red':'#27AE60'} ]}
        />
        <TouchableHighlight
          style={styles.btn}
          onPress={this.clickHandler}
          underlayColor="#0380BE"
          activeOpacity={1}
        >
          <Text style={{
            color: '#fff',
            fontWeight: '600'
          }}>
            {`Authenticate with ${this.state.biometryType}`}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
  function authenticate(props) {
    return TouchID.authenticate()
      .then(success => {
        AlertIOS.alert('Authenticated Successfully');
        AsyncStorage.setItem('userToken','AuthToken');
        props.navigation.navigate('Auth');
      })
      .catch(error => {
        console.log(error)
        AlertIOS.alert(error.message);
      });
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7f2'
  },
  btn: {
    borderRadius: 3,
    marginTop: 200,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#0391D7'
  }
});
