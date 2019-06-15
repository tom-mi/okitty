import React from 'react';
import './App.css';
import MainView from './components/MainView';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {MuiThemeProvider} from "@material-ui/core/styles";
import {THEME} from "./theme";

const App: React.FC = () => {
    return (
        <Router>
            <MuiThemeProvider theme={THEME}>
                <div className="App">
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
