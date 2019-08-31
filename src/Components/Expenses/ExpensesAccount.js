import React, {Component} from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import SQL from "../../Helpers/API/sql";

const sql = new SQL();

export class ExpensesAccount extends Component {

    static defaultProps = {
        accountId : 0,
        accountName : '',
    };

    state = {
        data : [],
        accountName : null
    }

    componentDidMount() {
        this.query(this.props.accountId);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.query(this.props.accountId);
    }

    query(accountId) {
        if(accountId != 0) {
            sql.transaction(
                tx => {
                    tx.executeSql(`SELECT expenses.*, accounts.name AS accountName FROM expenses
                LEFT JOIN accounts ON expenses.account_id = accounts.id 
                WHERE account_id = ${accountId}
        `, [], (_, { rows }) => {
                        this.setState({data : rows._array,
                            accountName: this.props.accountName});
                    })
                }
            );
        }

    }

    render() {
        if(this.props.accountId != 0) {
            let total = 0;
            const data = this.state.data.map((expense, key) => {
                total += expense.amount;
                return (

                    <View key={key} style={{flexDirection : "row"}} >
                        <View style={styles.boxExpense}>
                            <Text style={styles.expenseName}>{expense.name}</Text>
                        </View>
                        <View style={styles.boxExpense}>
                            <Text style={styles.expenseAmount}>{expense.amount} €</Text>
                        </View>
                    </View>
                );
            });


            return(
                <TouchableOpacity  onPress={() => this.sendId(this.props.accountId)}>
                    {(this.state.data.length > 0) ? (

                        <View style={styles.boxAccountExpenses}>
                            <View style={styles.boxAccountName}>
                                <Text style={styles.accountName}>{this.state.accountName}</Text>
                            </View>
                            {data}
                            <View style={{flexDirection : "row", marginTop: 20}} >
                                <View style={styles.boxExpense}>
                                    <Text style={styles.expenseName}>Total </Text>
                                </View>
                                <View style={styles.boxExpense}>
                                    <Text style={styles.expenseAmount}>{total} €</Text>
                                </View>
                            </View>
                        </View>
                    ) : (<View/>) }
                </TouchableOpacity>
            )

        }

    }

    sendId(id) {
        this.props.onPress(id);
    }
}

const styles = StyleSheet.create({
    boxAccountExpenses : {
        backgroundColor : "white",
        flexDirection : "column",
        justifyContent: "center",
        marginTop: 5,
        paddingBottom: 40,
        paddingTop : 30,
    },
    accountName : {
        fontSize : 28,
        fontWeight : "bold",
        textAlign : "center",
        marginLeft : 60,
        marginRight : 60,
    },
    boxExpense : {
        flex : 1, marginLeft : 60, marginRight : 60
    },
    expenseName : {
        textTransform : "uppercase",
        fontWeight: 'bold',
        color : '#00897B'
    },
    expenseAmount : {
        fontStyle : "italic",
        textAlign : "right",
    },
    boxAccountName : {marginBottom : 30, borderColor : "white", borderWidth : 1}
})