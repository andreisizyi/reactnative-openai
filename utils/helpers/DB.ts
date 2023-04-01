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
        this.connection = SQLite.openDatabase('TrueDataBase2.db');
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
          content TEXT,\
          role TEXT\
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

    newChat(text: string) {
        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'INSERT OR IGNORE INTO chats (name) VALUES (?)',
                [text],
                (tx: any, results: any) => {
                    console.log('Chat added successfully');
                    // Need return ID // TODO
                },
                (tx: any, error: any) => {
                    console.log('Error while adding chat:', error);
                },
            );
        });
    }

    newMessage(text: string, role: string) {
        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'INSERT INTO messages (content, role, chatId) VALUES (?, ?, ?)',
                [text, role, global.currentChat],
                (tx: any, results: any) => {
                    console.log('Message added successfully');
                },
                (tx: any, error: any) => {
                    console.log('Error while message chat:', error);
                },
            );
        });
    }

    getMessagesOfChat() {
        return new Promise((resolve, reject) => {
            this.connection.transaction((tx: any) => {
                tx.executeSql(
                    `SELECT content, role FROM messages WHERE chatId = ${global.currentChat}`,
                    null,
                    (tx: any, results: any) => {
                        resolve(results.rows._array);
                    },
                    (tx: any, error: any) => {
                        resolve([]);
                    },
                );
            });
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
                        resolve([]);
                    },
                );
            });
        });
    }

}

export default DB;