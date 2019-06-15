import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainView from './components/MainView';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {MuiThemeProvider} from "@material-ui/core/styles";
import {THEME} from "./theme.js";

const App: React.FC = () => {
    return (
        <Router>
            <MuiThemeProvider theme={THEME}>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                    </header>
                    <main className="App-main">
                        <Switch>
                            <Route path="/" exact component={MainView}/>
                            <MainView/>
                        </Switch>
                    </main>
                </div>
            </MuiThemeProvider>
        </Router>
    );
};

export default App;
