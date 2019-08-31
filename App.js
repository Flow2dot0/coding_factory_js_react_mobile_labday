import React from 'react';

import SQL from './src/Helpers/API/sql'
import Navigation from "./src/Components/Navigation/Navigation";

const sql = new SQL();




export default class App extends React.Component {

  componentDidMount() {
    sql.createTable("accounts", "id integer not null primary key, name varchar not null, type integer default 0, amount integer default 0");


    sql.createTable("expenses", `
    "id"	INTEGER NOT NULL PRIMARY KEY,
    "account_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount"	REAL DEFAULT 0,
    FOREIGN KEY("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE`
    )

    sql.createTable("projects", "id integer not null primary key, name varchar not null, type integer default 0, amount integer default 0, date varchar, amount_per_month integer, r_date varchar, r_amount integer")

  }

  render() {
    return (
      <Navigation />
    )
  }
}