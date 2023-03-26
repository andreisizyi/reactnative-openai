// createDB = async () => {

//     db.transaction((tx) => {
//         tx.executeSql('\
//                 CREATE TABLE IF NOT EXISTS chats (\
//                         id INTEGER PRIMARY KEY AUTOINCREMENT,\
//                         name TEXT,\
//                         lastMessage TEXT,\
//                         lastMessageTime TEXT\
//                     );\
//                 CREATE TABLE IF NOT EXISTS messages\
//                     (\
//                         id INTEGER PRIMARY KEY AUTOINCREMENT,\
//                         chatId INTEGER,\
//                         text TEXT,\
//                         sender TEXT,\
//                         time TEXT,\
//                         FOREIGN KEY(chatId) REFERENCES chats(id)\
//                     );\
//             ',
//             [],
//             (tx, results) => {
//                 console.log('Tables created successfully');
//             },
//             (tx, error) => {
//                 console.log('Error while creating the tables:', error);
//             },
//         );
//     });
// }

// storeData = async () => {
//     db.transaction((tx) => {
//         tx.executeSql(
//             'INSERT INTO chats (chatId, text, sender, time) VALUES (?, ?, ?, ?)',
//             [1, 'Hello', 'John', new Date().toISOString()],
//             (tx, results) => {
//                 console.log('Message added successfully');
//             },
//             (tx, error) => {
//                 console.log('Error while adding message:', error);
//             },
//         );
//     });
// }

// readData = async (table = null, id = null) => {
//     db.transaction((tx) => {
//         tx.executeSql(
//             'SELECT * FROM messages',
//             [],
//             (tx, results) => {
//                 console.log('Messages:', results.rows.raw());
//             },
//             (tx, error) => {
//                 console.log('Error while reading messages:', error);
//             },
//         );
//     });
// }

import React, { Component } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Fonts
import useFonts from './resources/fonts'
import * as SplashScreen from 'expo-splash-screen'

// Screens
import ChatScreen from './screens/Chat'
import ListScreen from './screens/List'





// SplashScreen
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(15 23 42)',
  },
};

interface AppState {
  appIsReady: number
}

import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset'


class App extends Component<{}, AppState> {

  // private openDatabase = async () => {
  //   // Define the name and location of the database file
  //   const dbFileName = 'database.db';
  //   const dbFolderPath = `${FileSystem.documentDirectory}SQLite/`;

  //   // Create the directory if it doesn't exist
  //   FileSystem.makeDirectoryAsync(dbFolderPath, { intermediates: true })
  //     .catch((error) => {
  //       console.log('Error creating directory:', error);
  //     });

  //   // Copy the database file to the app's file system if it doesn't exist
  //   const dbFilePath = `${dbFolderPath}${dbFileName}`;
  //   const dbFileUri = Asset.fromModule(require('./assets/database.db')).uri;

  //   FileSystem.getInfoAsync(dbFilePath)
  //     .then(({ exists }) => {
  //       if (!exists) {
  //         console.log(`Copying database file from ${dbFileUri} to ${dbFilePath}`);

  //         FileSystem.downloadAsync(dbFileUri, dbFilePath)
  //           .catch((error) => {
  //             console.log('Error copying database file:', error);
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error checking if database file exists:', error);
  //     });

  //   // Open a connection to the database
  //   const db = SQLite.openDatabase(dbFilePath);
  // };
  // private setupApp = async (): Promise<void> => {
  //   const db = await this.openDatabase();
  //   // Do something with the database
  // };
  constructor(props: {}) {
    super(props);
    this.state = {
      appIsReady: 0
    }

    // this.setupApp()


    this.db = SQLite.openDatabase('example9.db');
    //console.log(this.db);
    this.db.transaction((tx) => {
      tx.executeSql('\
          CREATE TABLE IF NOT EXISTS chats (\
                  id INTEGER PRIMARY KEY AUTOINCREMENT,\
                  name TEXT\
              );\
      ',
        [],
        (tx, results) => {
          console.log('Tables created successfully');
        },
        (tx, error) => {
          console.log('Error while creating the tables:', error);
        },
      );
    });
    this.db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO chats (name) VALUES (?)',
        ['sdfsdfsdf'],
        (tx, results) => {
          console.log('Message added successfully');
        },
        (tx, error) => {
          console.log('Error while adding message:', error);
        },
      );
    });
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM chats',
        null,
        (tx, results) => {
          console.log('Messages:', results.rows._array);
        },
        (tx, error) => {
          console.log('Error while reading messages:', error);
        },
      );
    });

    // this.db.transaction((tx) => {
    //   tx.executeSql('\
    //       CREATE TABLE IF NOT EXISTS messages (\
    //               id INTEGER PRIMARY KEY AUTOINCREMENT,\
    //               chatId INTEGER,\
    //               text TEXT,\
    //               sender TEXT,\
    //               time TEXT,\
    //               FOREIGN KEY(chatId) REFERENCES chats(id)\
    //           );\
    //   ',
    //     [],
    //     (tx, results) => {
    //       console.log('Tables created successfully');
    //     },
    //     (tx, error) => {
    //       console.log('Error while creating the tables:', error);
    //     },
    //   );
    // });
    // this.db.transaction((tx) => {
    //   tx.executeSql(
    //     'INSERT INTO chats (name) VALUES (?)',
    //     ['sdfsdfsdf'],
    //     (tx, results) => {
    //       console.log('Message added successfully');
    //     },
    //     (tx, error) => {
    //       console.log('Error while adding message:', error);
    //     },
    //   );
    // });

    // this.db.transaction((tx) => {
    //   tx.executeSql(
    //     'INSERT INTO messages (chatId, text, sender, time) VALUES (?, ?, ?, ?)',
    //     [1, 'Hello', 'John', new Date().toISOString()],
    //     (tx, results) => {
    //       console.log('Message added successfully');
    //     },
    //     (tx, error) => {
    //       console.log('Error while adding message:', error);
    //     },
    //   );
    // });

    // this.db.transaction(tx => {
    //   tx.executeSql(
    //     'SELECT * FROM chats',
    //     null,
    //     (tx, results) => {
    //       console.log('Messages:', results.rows.raw());
    //     },
    //     (tx, error) => {
    //       console.log('Error while reading messages:', error);
    //     },
    //   );
    // });
  }

  preloading = async () => {
    try {
      // Use fonts
      await useFonts()
    } catch (e) {
      console.warn(e)
    } finally {
      this.setState({ appIsReady: 1 })
      SplashScreen.hideAsync()
    }
  }

  componentDidMount() {
    // Onload methods
    this.preloading()
  }

  render() {
    return (
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;