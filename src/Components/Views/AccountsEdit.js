import React from 'react';
import {Alert, Platform, SafeAreaView, Text, View, StyleSheet, TextInput, Button, TouchableOpacity} from 'react-native';


import GlobalStyles from '../../Helpers/Styles/GlobalStyles';

import SegmentedControlTab from "react-native-segmented-control-tab";

import SQL from '../../Helpers/API/sql';
import Loading from '../Loading';

import IconV from 'react-native-vector-icons/FontAwesome'
const euroIcon = <IconV name="euro" size={25} color="#ff9800" />;
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';


const sql = new SQL();


export class AccountsEdit extends React.Component {
  
  constructor(props) {
    super(props);
    
    const { navigation } = this.props;

    var data = {
        id : navigation.getParam("id", 0),
        name : null,
        amount: "",
        type : null
    }


    
    this.state = {
        data : data,
        selectedIndex : 1,
        loading: (data.id > 0) ? true: false,
    }
    
  }

  Transaction() {
    var data = this.state.data;
    if(data.name != null && data.amount != null) {
      if(data.id != 0) {
          // Update
          sql.update("accounts", {
            name: data.name,
            type: this.state.selectedIndex,
            amount: data.amount
          }, {
            id : data.id
          })
      }else {
          // Add

              sql.insert("accounts", {
                  name : data.name,
                  type : this.state.selectedIndex,
                  amount : data.amount
              });


      }

      this.props.navigation.navigate("Accounts", { updated: true});
    }
  }


  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };

  componentDidMount() {
    if(this.state.data.id != 0) {
        sql.transaction(
            tx => {
                tx.executeSql('select * from accounts where id=?', [this.state.data.id], (_, { rows }) => {
                this.setState({
                    data : rows._array[0],
                    selectedIndex: rows._array[0].type,
                    loading: false
                });
        
                }
                );
            }
            
            );
    }
  }

  handleAccountName = (text) => {this.setState({data: {
      ...this.state.data,
      name : text
  }})};

  handleAmount = (text) => {this.setState({data: {
    ...this.state.data,
    amount : text
  }})};

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
  
    return {
      title: (state.params && state.params.title ? state.params.title : 'Ajouter un compte')
    };
  };

  render() {
    var button = (this.state.data.id != 0) ? "Modifier ce compte" : "Ajouter un compte";
    return(
      <SafeAreaView forceInset={Platform.OS === 'android' && { vertical: 'never' }}
      style={GlobalStyles.App}>
          <View style={GlobalStyles.container}>
          <View style={{flexDirection: 'column', flex: 1}}>
            {(this.state.loading) ? (
                <Loading loading={this.state.loading} />
             ) : (
            <View >


                <Card style={[GlobalStyles, {padding : 25}]}>
                    <CardItem style={{}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <TextInput
                                style={{fontSize: 25}}
                                placeholder={'Nom du compte'}
                                value={this.state.data.name}
                                onChangeText={this.handleAccountName}
                            />
                        </View>
                    </CardItem>

                </Card>
                <Card style={[GlobalStyles, {padding : 40}]}>
                    <CardItem style={{}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <SegmentedControlTab
                                values={["Compte épargne", "Compte courant"]}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleIndexChange}
                            />
                        </View>
                    </CardItem>

                </Card>
                <Card style={[GlobalStyles, {padding : 15}]}>
                    <CardItem style={{}}>
                        <View style={{flex: 1, justifyContent: 'center', flexDirection : 'row'}}>
                            <TextInput
                                // onChangeText={(text) => this.setState({text})}
                                // value={this.state.text}
                                style={{fontSize: 20, marginRight: 10, color: '#ff9800'}}
                                placeholder={'Montant du compte'}
                                keyboardType={'numeric'}
                                value={this.state.data.amount.toString()}
                                onChangeText={this.handleAmount}
                            />
                            {euroIcon}
                        </View>
                    </CardItem>

                </Card>
                <View style={{marginTop: 20}}>
                    <Button
                    title={button}
                    color="#00897B"
                    onPress={() => this.Transaction()}
                    />
                    {(this.state.data.id != 0) ? ( 
                      <View>
                      <Button
                        title="Supprimer ce compte"
                        color="red"
                        onPress={() => {
                          Alert.alert(
                            'Confirmation',
                            'Voulez-vous vraiment supprimer ce compte ?',
                            [
                              {
                                text: 'Non',
                                style: 'cancel',
                              },
                              {text: 'Oui', onPress: () => {
                                sql.delete("accounts", {
                                  id: this.state.data.id
                                });
                                this.props.navigation.navigate("Accounts", { updated: true});
                              }},
                            ],
                            {cancelable: false},
                          );
                        }}
                      />
                      </View>
                    ): (
                      false
                    )}
                </View>
            </View>
             )}
        </View>
      </View>
      </SafeAreaView>
    );
  }
}