import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight } from '../../../util/Common'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class AddAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      memo: '',
      address: ''
    }
    this.back = this.back.bind(this)
    this.save = this.save.bind(this)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeMemo = this.onChangeMemo.bind(this)
    this.onChangeAddress = this.onChangeAddress.bind(this)
    this.camrea = this.camrea.bind(this)
  }

  back() {
    this.props.rootStore.stateStore.iscamera = 0
    this.props.navigation.navigate('Addresses')
  }

  camrea() {
    this.props.rootStore.stateStore.tocamera = 2
    this.props.navigation.navigate('Camera')
  }

  onChangeName(ChangeName) {
    this.setState({
      name: ChangeName
    })
  }

  onChangeMemo(ChangeMemo) {
    this.setState({
      memo: ChangeMemo
    })
  }

  onChangeAddress(ChangeAddress) {
    if (this.props.rootStore.stateStore.iscamera == 1) {
      this.props.rootStore.stateStore.iscamera = 0
    }
    this.setState({
      address: ChangeAddress
    })
  }

  save() {
    if (!this.state.name || !this.state.memo || !this.state.address) {
      return Alert.alert('', i18n.t('TAB.enterInformation'))
    }
    AsyncStorage.getItem('Addresses').then(result => {
      if (result == null) {
        AsyncStorage.setItem(
          'Addresses',
          JSON.stringify([
            {
              Name: this.state.name,
              Memo: this.state.memo,
              Address: this.state.address
            }
          ])
        ).then(() => {
          Alert.alert('', i18n.t('Profile.SaveSuccess'))
          this.props.navigation.navigate('Addresses')
        })
      } else {
        if (this.state.address == '' && this.props.rootStore.stateStore.iscamera == 0) {
          Alert.alert('', i18n.t('TAB.enterInformation'))
        } else {
          let a = JSON.parse(result)
          a.push({
            Name: this.state.name,
            Memo: this.state.memo,
            Address:
              this.props.rootStore.stateStore.iscamera == 0
                ? this.state.address
                : this.props.rootStore.stateStore.QRaddress
          })
          AsyncStorage.setItem('Addresses', JSON.stringify(a)).then(() => {
            this.props.rootStore.stateStore.iscamera = 0
            this.props.navigation.navigate('Tabbed_Navigation')
          })
        }
      }
    })
  }

  render() {
    const msg = [i18n.t('Profile.Name'), i18n.t('Profile.Memo'), i18n.t('Profile.Address')]
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <Header navigation={this.props.navigation} title={i18n.t('Profile.addAddresses')} theme="dark" />

        <RNKeyboardAvoidView>
          <View style={{ marginTop: 28, alignItems: 'center' }}>
            {msg.map((item, index) => {
              return (
                <View style={styles.view} key={index}>
                  {
                    <View style={[styles.inputview]}>
                      <TextInput
                        style={[
                          styles.textInputStyle,
                          {
                            width: index == 2 ? ScreenWidth - 60 : ScreenWidth - 40
                          }
                        ]}
                        placeholder={item}
                        autoCorrect={false}
                        underlineColorAndroid="#ffffff00"
                        onChangeText={
                          index == 0 ? this.onChangeName : index == 1 ? this.onChangeMemo : this.onChangeAddress
                        }
                      />
                      {index == 2 && (
                        <TouchableOpacity onPress={this.camrea}>
                          <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../../assets/images/public/addaddresses_code.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  }
                </View>
              )
            })}
          </View>
        </RNKeyboardAvoidView>
        <TouchableOpacity style={styles.Change} onPress={this.save}>
          <Image source={require('../../../assets/images/public/addaddresses_save.png')} />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  title: {
    padding: ScreenHeight / 50,
    height: ScreenHeight / 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#776f71'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: '#e6e6e6'
  },
  image_title: {
    height: ScreenHeight / 33.35,
    width: ScreenHeight / 33.35,
    resizeMode: 'contain'
  },
  save_touch: {
    width: ScreenHeight / 33.35 + ScreenWidth * 0.06,
    justifyContent: 'center',
    alignItems: 'center'
  },
  save_text: {
    color: 'white',
    fontSize: ScreenWidth / 28
  },
  view: {
    justifyContent: 'center',
    height: ScreenHeight / 8
  },
  text: {
    marginLeft: ScreenWidth * 0.06,
    color: 'black',
    fontWeight: '400'
  },
  textInputStyle: {
    color: '#696969',
    width: ScreenWidth - 40,
    fontSize: ScreenHeight / 45
  },
  inputview: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 57,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE2E5',
    width: ScreenWidth - 40
  },
  Change: {
    alignSelf: 'center',
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default AddAddress