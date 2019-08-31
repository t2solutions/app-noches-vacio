import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import { NVInputDropdownStyles as styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';

class NVInputDropdown extends Component {

  constructor(props) {
    super(props);
  }

  selectRow(index) {
    const { onSelect, items } = this.props;
    onSelect(items[index]);
  }

  render() {
    const { containerStyles, placeholder, selected, items } = this.props;
    const containerHeight = (items.length > 0) ? (items.length > 4) ? 4 * 40: items.length * 40 : 0;
    return (
      <TouchableOpacity style={[styles.container, containerStyles]} onPress={()=>{this.dropdown.show()}}>
        <ModalDropdown
          style={styles.containerDropDown}
          ref={component => this.dropdown = component}
          dropdownStyle={{ flex: 1, backgroundColor: 'white', marginLeft: 8, height: containerHeight}}
          dropdownTextStyle={{ color: 'black', fontSize: 15, fontFamily: 'nunito-regular', height: 40 }}
          dropdownTextHighlightStyle={{backgroundColor: 'gray'}}
          onSelect={(index) => this.selectRow(index)}
          options={_.map(items, option => option.descripcion)}>
          {selected ?
            <Text style={styles.dropDownInput}>{selected}</Text> :
            <Text style={styles.dropDownPlaceholder}>{placeholder} </Text>
          }
        </ModalDropdown>
        <Ionicons name={'ios-arrow-down'} size={15} color={'black'} />
      </TouchableOpacity>
    );
  }

}

NVInputDropdown.defaultProps = {
  containerStyles: {},
  placeholder: '',
  items: [{id: 'empty', description: 'Selecciona opción'}],
  selected: null,
  onSelect: ()=> {}
}

NVInputDropdown.propTypes = {
  containerStyles: PropTypes.object,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  selected: PropTypes.string,
  onSelect: ()=> {}
}

export { NVInputDropdown };
     