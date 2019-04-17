import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const PUMA_HOME_URL = 'https://www.pumabrowser.com/';
const PUMA_CAREER_URL = "https://www.pumabrowser.com/careers";
const CAREER = "Career";
const HOME = "Home";

const injectScript = `
(function () {
  window.onclick = function(e) {
    if(e.target && e.target.href){
      window.ReactNativeWebView.postMessage('Career');
  }
  else {
    window.ReactNativeWebView.postMessage('Home');
  }
  }
}());
`;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            webviewUrl: PUMA_HOME_URL,
            navigationStateChanged: false
        };
    }

    showAdrressBar = (e) => {
        e === 1
            ? this.setState({loaded: true})
            : null
    }

    respondToOnMessage = (e) => {
        if (e === HOME) {
            setTimeout(() => {
                this.setState({webviewUrl: PUMA_HOME_URL})
            }, 200);
        } else {
            setTimeout(() => {
                this.setState({webviewUrl: PUMA_CAREER_URL})
            }, 200);
        }
    };

    onSwipeLeft = (gestureState) => {
        if (this.state.webviewUrl === PUMA_HOME_URL) {
                this.setState({webviewUrl: PUMA_CAREER_URL})
        }
    }

    onSwipeRight = (gestureState) => {
        if (this.state.webviewUrl === PUMA_CAREER_URL) {
                this.setState({webviewUrl: PUMA_HOME_URL})
        }
    }

    render() {
        const {webviewUrl, loaded} = this.state
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (
            <GestureRecognizer
                onSwipeLeft={(state) => this.onSwipeLeft(state)}
                onSwipeRight={(state) => this.onSwipeRight(state)}
                config={config}
                style={styles.container}>
                {loaded
                    ? <View style={styles.AddressBarView}>
                            <Text style={styles.AddressBarText}>
                                {webviewUrl}
                            </Text>
                        </View>
                    : null
                }
                <WebView
                    source={{
                    uri: webviewUrl
                }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    javaScriptEnabledAndroid={true}
                    onLoadProgress={(e) => this.showAdrressBar(e.nativeEvent.progress)}
                    onMessage={event => this.respondToOnMessage(event.nativeEvent.data)}
                    injectedJavaScript={injectScript}/>
            </GestureRecognizer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: (Platform.OS) === 'ios'
            ? 20
            : 0,
        flex: 1,
        backgroundColor: '#000000'
    },
    AddressBarView: {
        width: Dimensions
            .get('window')
            .width - 10,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 5,
        height: 30
    },
    AddressBarText: {
        paddingTop: 5,
        paddingLeft: 20

    }
});
