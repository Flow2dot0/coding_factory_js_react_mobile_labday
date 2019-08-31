import React from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import DatePicker from 'react-native-datepicker'

import GlobalStyles from '../../Helpers/Styles/GlobalStyles';
import Loading from "../Loading";
import SegmentedControlTab from "react-native-segmented-control-tab";
import moment from "moment";
import SQL from '../../Helpers/API/sql';
import {Card, CardItem} from "native-base";

const sql = new SQL();
const myIcon = <Icon name="money" size={30} color="#900" />;

export class ProjectsEdit extends React.Component {
    constructor(props){
        super(props)

        const { navigation } = this.props;

        var data = {
            id : navigation.getParam("id", 0),
            name : null,
            amount: "",
            type : null,
            date : null,
            amount_per_month: "",
        }


        this.state = {
            data : data,
            selectedIndex : 0,
            loading: (data.id > 0) ? true: false,
        }
    }


    Transaction() {
        var data = this.state.data;
        if(data.name != null && data.amount != null) {
            if(data.id != 0) {
                // Update
                sql.update("projects", {
                    name: data.name,
                    type: this.state.selectedIndex,
                    amount: data.amount,
                    date : data.date,
                    amount_per_month : data.amount_per_month,
                }, {
                    id : data.id
                })
            }else {
                // Add

                sql.insert("projects", {
                    name : data.name,
                    type : this.state.selectedIndex,
                    amount : data.amount,
                    date : data.date,
                    amount_per_month : data.amount_per_month,
                });
            }
            this.props.navigation.navigate("Projects", { updated: true});
        }
    }

    calculateDateWithAmountPerMonth (text) {
        if(this.state.data.amount != null)
        {
            const amountPerMonth = text
            const times = Math.round(this.state.data.amount/amountPerMonth)
            const endDate = moment().add(times, 'M').format('YYYY-MM-DD')
            this.setState({data: {
                    ...this.state.data,
                    date : endDate,
                    amount_per_month : Math.round(text)
                }})
        }
    }

    calculateAmountWithDate = (text) => {
        const dateChoosen = text
        if(this.state.data.amount != null) {
            const actualDate = moment().format('YYYY-MM-DD')
            const tmp = moment(dateChoosen).diff(actualDate, 'months', true)
            const calcul =  this.state.data.amount/tmp
            this.setState({data: {
                    ...this.state.data,
                    amount_per_month : Math.round(calcul),
                    date : text
                }})
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
                    tx.executeSql('select * from projects where id=?', [this.state.data.id], (_, { rows }) => {
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
            amount : Math.round(text)
        }})};

    handleRAmount = (text) => {
        this.calculateDateWithAmountPerMonth(text)
    };

    handleRDate = (text) => {
        this.calculateAmountWithDate(text)
    };

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;

        return {
            title: (state.params && state.params.title ? state.params.title : 'Ajouter un projet')
        };
    };

  render() {
      var button = (this.state.data.id != 0) ? "Modifier ce projet" : "Ajouter un projet";
    return (
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
                                          placeholder={(this.state.data.name != null) ? this.state.data.name : 'MacBook 15' }
                                          value={this.state.data.name}
                                          maxLength={20}
                                          onChangeText={this.handleAccountName}
                                          style={{fontSize: 30, textAlign: 'center'}}
                                      />
                                  </View>
                              </CardItem>

                          </Card>

                          <Card style={[GlobalStyles, {padding : 15}]}>
                              <CardItem style={{}}>
                                  <View style={{flex: 1, alignItems: 'center'}}>
                                      <TextInput
                                          maxLength={5}
                                          placeholder={'3000 €'}
                                          keyboardType={'number-pad'}
                                          value={this.state.data.amount.toString()}
                                          onChangeText={this.handleAmount}
                                          style={{fontSize: 20, textAlign: 'center'}}
                                      />
                                  </View>
                              </CardItem>

                          </Card>

                          <Card style={[GlobalStyles, {padding : 40}]}>
                              <CardItem style={{}}>
                                  <View style={{flex: 1, alignItems: 'center'}}>
                                      <SegmentedControlTab
                                          values={["Mensualité", "Date"]}
                                          selectedIndex={this.state.selectedIndex}
                                          onTabPress={this.handleIndexChange}
                                      />
                                  </View>
                              </CardItem>
                          </Card>
                          {(this.state.selectedIndex == 0) ? (
                              <Card style={[GlobalStyles, {padding : 15}]}>
                                  <CardItem style={{}}>
                                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',flexDirection  :'row'}}>
                                      <View style={{marginRight: 10}}>
                                          {myIcon}
                                      </View>
                                      <View>
                                          <TextInput
                                              maxLength={5}
                                              placeholder={'choisir un montant'}
                                              keyboardType={'number-pad'}
                                              value={this.state.data.amount_per_month.toString()}
                                              onChangeText={this.handleRAmount}
                                              style={{borderWidth: 0.5, borderRadius: 5, padding: 10, borderColor: '#d8d4d4', width: 160, textAlign: 'center'}}
                                          />
                                      </View>
                                      </View>
                                  </CardItem>

                              </Card>

                          ) : (

                              <Card style={[GlobalStyles, {padding : 15}]}>
                                  <CardItem style={{}}>
                                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',flexDirection  :'row', marginBottom: 8}}>
                                          <DatePicker
                                              locale={'fr'}
                                              style={{width: 200, height: 30}}
                                              date={this.state.data.date}
                                              mode="date"
                                              placeholder={'choisir une date'}
                                              format="YYYY-MM-DD"
                                              minDate={moment().format('YYYY-MM-DD')}
                                              maxDate={moment().add(30, 'years').format('YYYY-MM-DD')}
                                              confirmBtnText="Confirm"
                                              cancelBtnText="Cancel"
                                              customStyles={{
                                                  dateIcon: {
                                                      position: 'absolute',
                                                      left: 0,
                                                      top: 4,
                                                      marginLeft: 0
                                                  },
                                                  dateInput: {
                                                      marginLeft: 36
                                                  }
                                                  // ... You can check the source to find the other keys.
                                              }}
                                              onDateChange={this.handleRDate}
                                          />
                                      </View>
                                  </CardItem>

                              </Card>
                          )}


                          <View style={{marginTop: 20}}>
                              <Button
                                  title={button}
                                  color="#00897B"
                                  onPress={() => this.Transaction()}
                              />
                              {(this.state.data.id != 0) ? (
                                  <View>
                                      <Button
                                          title="Supprimer ce projet"
                                          color="red"
                                          onPress={() => {
                                              Alert.alert(
                                                  'Confirmation',
                                                  'Voulez-vous vraiment supprimer ce projet ?',
                                                  [
                                                      {
                                                          text: 'Non',
                                                          style: 'cancel',
                                                      },
                                                      {text: 'Oui', onPress: () => {
                                                              sql.delete("projects", {
                                                                  id: this.state.data.id
                                                              });
                                                              this.props.navigation.navigate("Projects", { updated: true});
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
        {/* Rest of the app comes ABOVE the action button component !*/}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    titles : {textTransform : 'uppercase', textAlign : 'center'},
    inputs : {margin : 20, height: 40, borderColor: 'gray', borderBottomWidth: 1, textAlign : 'center'},
    boxes : {height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 30}
})