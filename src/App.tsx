import React from 'react';
import './App.css';
import MainView from './components/MainView';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {MuiThemeProvider} from "@material-ui/core/styles";
import {THEME} from "./theme";
import {SnackbarProvider} from "notistack";
import Notifier from "./components/Notifier";
import Login from "./components/Login";

const App: React.FC = () => {
    return (
        <Router>
            <MuiThemeProvider theme={THEME}>
                <SnackbarProvider maxSnack={5}>
                    <Notifier/>
                    <div className="App">
                        <main className="App-main">
                            <Login/>
                            <Switch>
                                <Route path="/" exact component={MainView}/>
                                <MainView/>
                            </Switch>
                        </main>
                    </div>
                </SnackbarProvider>
            </MuiThemeProvider>
        </Router>
    );
};

export default App;
