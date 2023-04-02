import * as SQLite from 'expo-sqlite';

interface Chat {
  id: number;
  name: string;
}

interface Message {
  id: number;
  chatId: number;
  content: string;
  role: string;
}

interface Option {
  id: number;
  name: number;
  value: string;
}

class DB {
  private static instance: DB;
  private connection: SQLite.WebSQLDatabase;

  private constructor() {
    this.initDB();
  }

  public static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  private initDB(): void {
    this.connection = SQLite.openDatabase('DataBaseAI.db');

    // Adding foreign key to messages table
    this.connection.transaction((tx) => {
      tx.executeSql(
        `ALTER TABLE messages ADD FOREIGN KEY(chatId) REFERENCES chats(id) ON DELETE CASCADE;`,
        [],
        () => console.log('Foreign key added successfully'),
        (_, error) => {
          console.log('Error while adding foreign key:', error);
          return true;
        },
      );
    });

    // Creating tables if not exists
    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chatId INTEGER,
        content TEXT,
        role TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name INTEGER,
        value TEXT
      );`,
    ];

    createTableQueries.forEach((query) => {
      this.connection.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          () => console.log(`Table created successfully or exists`),
          (_, error) => {
            console.log('Error while creating the table:', error);
            return true;
          },
        );
      });
    });
  }

  newChat(text: string): Promise<number> {
    if (global.currentChat !== 0) return global.currentChat
    return new Promise((resolve, reject) => {
      this.connection.transaction((tx) => {
        tx.executeSql(
          'INSERT OR IGNORE INTO chats (name) VALUES (?)',
          [text],
          (_, results) => {
            console.log('Chat added successfully with id ' + results.insertId);
            global.currentChat = results.insertId;
            resolve(results.insertId);
          },
          (_, error) => {
            resolve(global.currentChat);
            return true;
          },
        );
      });
    });
  }

  newMessage(text: string, role: string, chatId: number): void {
    this.connection.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO messages (content, role, chatId) VALUES (?, ?, ?)',
        [text, role, chatId],
        () => console.log('Message added successfully: ' + text + role + chatId),
        (_, error) => {
          console.log('Error while message chat:', error);
          return true;
        },
      );
    });
  }

  getMessagesOfChat(id: number): Promise<Message[]> {
    if (id == 0) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      this.connection.transaction((tx) => {
        tx.executeSql(
          `SELECT content, role FROM messages WHERE chatId = ?`,
          [id],
          (_, results) => {
            resolve(results.rows._array as Message[]);
          },
          (_, error) => {
            resolve([]);
            return true;
          },
        );
      });
    });
  }

  getChats(): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      this.connection.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM chats ORDER BY id DESC',
          [],
          (_, results) => {
            resolve(results.rows._array as Chat[]);
          },
          (_, error) => {
            resolve([]);
            return true;
          },
        );
      });
    });
  }

  removeChat(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.connection.transaction((tx) => {
        // tx.executeSql(
        //   `DELETE FROM messages WHERE chatId = ?`,
        //   [id],
        //   () => {
        //     resolve(true);
        //     console.log('Messages deleted');
        //   },
        //   (_, error) => {
        //     resolve(false);
        //     return true;
        //   },
        // ); // Not need delete messages becouse foreign keys on chat id
        tx.executeSql(
          `DELETE FROM chats WHERE id = ?`,
          [id],
          () => {
            resolve(true);
            console.log('Chat with messages deleted');
          },
          (_, error) => {
            resolve(false);
            return true;
          },
        );
      });
    });
  }

  removeAllChats(): Promise<boolean> {
    return new Promise((resolve) => {
      this.connection.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM chats`,
          null,
          () => {
            resolve(true);
            console.log('All chats with messages deleted');
          },
          (_, error) => {
            resolve(false);
            return true;
          },
        );
      });
    });
  }

  saveApiKey(apiKey: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!apiKey) {
        console.log('Empty API key');
        resolve(false);
        return;
      }
      this.connection.transaction((tx) => {
        tx.executeSql(
          'INSERT OR REPLACE INTO options (name, value) VALUES (?, ?)',
          ['api_key', apiKey],
          (_, result) => {
            console.log('API key saved successfully');
            resolve(true);
          },
          (_, error) => {
            console.log('Error while saving API key:', error);
            resolve(false);
            return true;
          },
        );
      });
    });
  }

  async getApiKey(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.connection.transaction((tx) => {
        tx.executeSql(
          'SELECT value FROM options WHERE name = ?',
          ['api_key'],
          (_, results) => {
            console.log(results.rows.item(0))
            const row = results.rows.item(0);
            if (row) {
              resolve(row.value);
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.log('Error while getting API key:', error);
            resolve(null);
            return true;
          },
        );
      });
    });
  }
  
}

export default DB;