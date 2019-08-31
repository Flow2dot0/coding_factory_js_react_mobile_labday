import React from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View, FlatList, Image, TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';

import GlobalStyles from '../../Helpers/Styles/GlobalStyles';

import SQL from '../../Helpers/API/sql'
import {ExpensesAccount} from "../Expenses/ExpensesAccount";
import Loading from "../Loading";

import {NavigationEvents} from 'react-navigation'

const sql = new SQL();

export class Expenses extends React.Component {

  state = {
    loading : true,
    updated: false,
    account: []
  };

  componentWillReceiveProps() {
    this.setState({updated: true, loading: false});
    this.refresh();
  }p

  componentDidMount() {


    this.refresh();

  }

  refresh() {
    sql.transaction(
        tx => {
          tx.executeSql(`SELECT id, name FROM accounts
        `, [], (_, { rows }) => {
            let accounts = [];

            let row = rows._array;

            for(let [key, account] of Object.entries(row)) {
              accounts.push(account);
            }

            this.setState({
              updated: true,
              loading: false,
              account: accounts}
            );
          })
        });
  }

  render() {

    const { account } = this.state;

    if(this.state.loading === true) {
      return(
          <Loading />
      )
    }else {
      return (
          <SafeAreaView forceInset={Platform.OS === 'android' && { vertical: 'never' }}
                        style={GlobalStyles.App}>
              <NavigationEvents
                  onWillFocus={() => {
                      this.refresh();
                  }}
              />
            <View style={[GlobalStyles.container, {padding : 0}]}>
              {(account.length > 0) ? (
                  <View>
                    {
                      this.state.account.map((accounts, key) => {
                        return <ExpensesAccount update={this.state.updated} key={key} accountId={accounts.id} accountName={accounts.name} onPress={() => this.navigateForEdit(accounts.id)} />
                      })
                    }
                  </View>
                ) : (
                  <View style={styles.centering}>
                    <Image source={require('../../../assets/empty.png')} />
                    <Text>Veuillez ajouter un compte</Text>
                  </View>
              )}
              {(account.length > 0) ? (
                <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => this.props.navigation.navigate('Settings')} />
                  ) : ( <View/> )}

            </View>
          </SafeAreaView>
      );
    }
  }

  navigateForEdit(accountId) {
    this.props.navigation.navigate("Settings", {
      id : accountId,
      title: "Modifier des charges"
    })
  }
}

const styles = StyleSheet.create({
  centering: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
