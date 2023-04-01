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
        this.connection = SQLite.openDatabase('TrueDataBase7.db');
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
        return new Promise((resolve, reject) => {
            this.connection.transaction((tx: any) => {
                tx.executeSql(
                    'INSERT OR IGNORE INTO chats (name) VALUES (?)',
                    [text],
                    (tx: any, results: any) => {
                        console.log('Chat added successfully with id ' + results.insertId);
                        global.currentChat = results.insertId
                        resolve(results.insertId);
                    },
                    (tx: any, error: any) => {
                        resolve(global.currentChat)
                    },
                );
            });
        });
    }

    newMessage(text: string, role: string, chatId: number) {
        this.connection.transaction((tx: any) => {
            tx.executeSql(
                'INSERT INTO messages (content, role, chatId) VALUES (?, ?, ?)',
                [text, role, chatId],
                (tx: any, results: any) => {
                    console.log('Message added successfully');
                },
                (tx: any, error: any) => {
                    console.log('Error while message chat:', error);
                },
            );
        });
    }

    getMessagesOfChat(id: number) {
        if (id === 0) return []
        return new Promise((resolve, reject) => {
            this.connection.transaction((tx: any) => {
                tx.executeSql(
                    `SELECT content, role, chatId FROM messages WHERE chatId = ${id}`,
                    null,
                    (tx: any, results: any) => {
                        console.log(results.rows._array)
                        resolve(results.rows._array)
                    },
                    (tx: any, error: any) => {
                        resolve([]);
                    },
                );
            });
        });
    }

    getChats() {
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

    removeChat(id: number) {
        return new Promise((resolve, reject) => {
            this.connection.transaction((tx: any) => {
                tx.executeSql(
                    `DELETE FROM messages WHERE chatId = ${id}`,
                    null,
                    (tx: any, results: any) => {
                        resolve('ok');
                        console.log('Messages deleted');
                    },
                    (tx: any, error: any) => {
                        resolve('ok');
                    },
                );
            });
            this.connection.transaction((tx: any) => {
                tx.executeSql(
                    `DELETE FROM chats WHERE id = ${id}`,
                    null,
                    (tx: any, results: any) => {
                        resolve('ok');
                        console.log('Chat deleted');
                    },
                    (tx: any, error: any) => {
                        resolve('ok');
                    },
                );
            });

        })
    }

}

export default DB;