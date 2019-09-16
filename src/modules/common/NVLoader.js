import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text } from 'react-native';
import { NVLoaderStyles as styles } from './styles';
import Pulse from 'react-native-pulse';

class NVLoader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { visible, text } = this.props;
    return(
      <Modal
        onRequestClose={()=>{}}
        transparent={true}
        animationType="fade"
        visible={visible} >
        <View style={styles.container}>
          <Pulse color='rgba(255,255,255, 0.37)' numPulses={3} diameter={150} speed={20} duration={500} />
          <Text style={styles.paymentText}>{text}</Text>
        </View>
      </Modal>
    );
  }

}

NVLoader.defaultProps = {
  visible: false,
  text: 'Conectando'
};

NVLoader.propTypes = {
  visible: PropTypes.bool,
  text: PropTypes.string
}

export { NVLoader };