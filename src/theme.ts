import {createMuiTheme} from "@material-ui/core";
import {purple} from "@material-ui/core/colors";

export const THEME = createMuiTheme({
    palette: {
        primary: {
            main: '#304ffe',
        },
        secondary: purple,
    },
    overrides: {
        MuiButton: {
            root: {
                margin: '8px',
            }
        },
        MuiFormControl: {
            root: {
                margin: '8px',
            }
        },
    },
});
