import * as SQLite from 'expo-sqlite';

interface Chat {
    id: number;
    name: string;
}

interface Message {
    id: number;
    chatId: number;
    name: string;
    sender: string;
}

interface Option {
    id: number;
    name: number;
    value: string;
}

class DB {
    private static instance: DB;
    private connection: any;

    constructor(start = 30) {
        
        this.initDB();
    }

    public static getInstance(): DB {
        if (!DB.instance) {
          DB.instance = new DB();
        }
        return DB.instance;
    }

    private initDB() {
        this.connection = SQLite.openDatabase('databaseq1.db');
        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS chats (\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          name TEXT\
        );',
                [],
                (tx: any, results: any) => {
                    console.log('Table "chats" created successfully');
                },
                (tx: any, error: any) => {
                    console.log('Error while creating the table "chats":', error);
                },
            );
        });

        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS messages (\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          chatId INTEGER,\
          name TEXT,\
          sender TEXT\
        );',
                [],
                (tx: any, results: any) => {
                    console.log('Table "messages" created successfully');
                },
                (tx: any, error: any) => {
                    console.log('Error while creating the table "messages":', error);
                },
            );
        });

        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS options (\
          id INTEGER PRIMARY KEY AUTOINCREMENT,\
          name INTEGER,\
          value TEXT\
        );',
                [],
                (tx: any, results: any) => {
                    console.log('Table "options" created successfully');
                },
                (tx: any, error: any) => {
                    console.log('Error while creating the table "options":', error);
                },
            );
        });
    }

    newChat() {
        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'INSERT INTO chats (name) VALUES (?)',
                ['example_first_chat'],
                (tx: any, results: any) => {
                    console.log('Chat added successfully');
                },
                (tx: any, error: any) => {
                    console.log('Error while adding chat:', error);
                },
            );
        });
    }

    async getChats() {
        return new Promise((resolve, reject) => {
            this.connection.transaction((tx: any) => {
                tx.executeSql(
                    'SELECT * FROM chats',
                    null,
                    (tx: any, results: any) => {
                        resolve(results.rows._array);
                    },
                    (tx: any, error: any) => {
                        reject(error);
                    },
                );
            });
        });
    }

}

export default DB;