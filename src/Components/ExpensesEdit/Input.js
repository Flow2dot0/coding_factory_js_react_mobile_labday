import React, {Component} from "react";
import {Button, TextInput, View} from "react-native";
import SQL from "../../Helpers/API/sql";

const sql = new SQL();


export class Input extends Component {

    state = {
        expenses: [{
            name: "",
            amount: ""
        }]
    };

    static defaultProps = {

    };

    componentDidMount() {
        if(this.props.data !== false) {
            sql.transaction(
                tx => {
                    tx.executeSql('select * from expenses where account_id=?', [this.props.data], (_, { rows }) => {
                            this.setState({
                                expenses : rows._array
                            });

                            this.props.onChange(this.state.expenses);

                        }
                    );
                }

            );
        }
    }


    render() {
        const input = this.state.expenses.map((input, key) => {
            return(
                <View key={key} style={{flexDirection : 'row', marginBottom : 20}} >
                    <View style={{flex: 4, marginLeft : 40}}>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderBottomWidth: 1}}
                            // onChangeText={(text) => this.setState({text})}
                            value={this.state.expenses[key].name}
                            placeholder={'Mon loyer'}
                            onChange={(e) => this.handleChange(e, key, "name")}
                        />
                    </View>
                    <View style={{flex: 3, marginLeft : 40}}>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderBottomWidth: 1, textAlign : 'right'}}
                            // onChangeText={(text) => this.setState({text})}
                            //value={key.toString()}
                            keyboardType={'numeric'}
                            placeholder={'600.00 €'}
                            value={this.state.expenses[key].amount.toString()}
                            onChange={(e) => this.handleChange(e, key, "amount")}
                        />
                    </View>
                    <View style={{flex : 2}}>
                        {(key == (this.state.expenses.length -1)) ? (
                            <Button
                                onPress={() => this.addInput()}
                                title="&#10010;"
                                color="#28a745"
                            />
                        ):<Button
                            onPress={() => this.handleRemove(key)}
                            title="&#10008;"
                            color="#cc0001"
                        />}

                    </View>
                </View>
            )
        })


        return(input);

    }

    addInput() {
        this.setState({
            expenses:
                [...this.state.expenses,
                {
                    name :"",
                    amount: ""
                }]

        })

        this.props.onChange(this.state.expenses);

    }

   handleRemove(key) {
        this.state.expenses.splice(key,1);
        this.setState({
            expenses: this.state.expenses
        })


       this.props.onChange(this.state.expenses);
    }

    handleChange(e, key, type) {
        let change = e.nativeEvent.text;
        let expense = this.state.expenses;
        if(type === "name") {
            expense[key].name = change;
        }else {
            expense[key].amount = change.replace(',', '.');
        }
        this.setState({expense})


    }
}