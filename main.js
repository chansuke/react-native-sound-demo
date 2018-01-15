import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert
} from 'react-native';
import Sound from 'react-native-sound';

const Button = ({title, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

const Header = ({children, style}) => <Text style={[styles.header, style]}>{children}</Text>;

const Feature = ({title, onPress, description, buttonLabel = 'PLAY', status}) => (
  <View style={styles.feature}>
    <Header style={{flex: 1}}>{title}</Header>
    {status ? <Text style={{padding: 5}}>{resultIcons[status] || ''}</Text> : null}
    <Button title={buttonLabel} onPress={onPress} />
  </View>
);

const resultIcons = {
  '': '',
  pending: '?',
  playing: '\u25B6',
  win: '\u2713',
  fail: '\u274C',
};

const audioTests = [
  {
    url: 'advertising.mp3',
    basePath: Sound.MAIN_BUNDLE,
  },
  {
    url: 'advertising.mp3',
    basePath: Sound.MAIN_BUNDLE,
  },
];


class MainView extends Component {
  constructor(props) {
    super(props);

    Sound.setCategory('Playback', true); // true = mixWithOthers

    // Special case for stopping
    this.stopSoundLooped = () => {
      if (!this.state.loopingSound) {
        return;
      }

      this.state.loopingSound.stop().release();
      this.setState({loopingSound: null, tests: {...this.state.tests, ['mp3 in bundle (looped)']: 'win'}});
    };

    this.state = {
      loopingSound: undefined,
      tests: {},
    };
  }

  playSounds = (testInfo) => {
    const callback = (error, sound) => {
      if (error) {
        Alert.alert('error', error.message);
        return;
      }

      sound.play(() => {
        sound.release();
      });
    };

    let sound;
    if (testInfo.isRequire) {
      sound = new Sound(testInfo.url, error => callback(error, sound));
    } else {
      sound = new Sound(testInfo.url, testInfo.basePath, error => callback(error, sound));
    }
    sound.stop(() => console.log("stopped"));
  }

  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.title}>english-study-app-demo</Header>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Feature
            title="連続再生テスト"
            onPress={() => {
              audioTests.forEach((audio) => {
                this.playSounds(audio);
              })
            }}
          />
          <Feature title="停止ボタンテスト" buttonLabel={'STOP'} onPress={this.stopSoundLooped} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 30,
    padding: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(240,240,240,1)',
  },
  button: {
    fontSize: 20,
    backgroundColor: 'rgba(220,220,220,1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    padding: 7,
  },
  header: {
    textAlign: 'left',
  },
  feature: {
    flexDirection: 'row',
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
  },
});

export default MainView;
