import { createTheme, responsiveFontSizes, Theme, ThemeProvider } from '@material-ui/core/styles';
import React, { useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// components
import Layout from './components/Layout';
// app routes
import { routes } from './config';
// interfaces
import RouteItem from './model/RouteItem.model';
// theme
import { darkTheme, lightTheme } from './theme/appTheme';
// constants
import { APP_TITLE } from './utils/constants';

// define app context
const AppContext = React.createContext(null);

// default component
const DefaultComponent = () => <div>No Component Defined.</div>;

function App() {
  const [useDefaultTheme, toggle] = useReducer((theme) => !theme, true);

  // define custom theme
  let theme: Theme = createTheme(useDefaultTheme ? lightTheme : darkTheme);
  theme = responsiveFontSizes(theme);

  return (
    <>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      <AppContext.Provider value={null}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Layout toggleTheme={toggle} useDefaultTheme={useDefaultTheme}>
                {/* for each route config, a react route is created */}
                {routes.map((route: RouteItem) =>
                  route.subRoutes ? (
                    route.subRoutes.map((item: RouteItem) => (
                      <Route
                        key={`${item.key}`}
                        path={`${item.path}`}
                        component={item.component || DefaultComponent}
                        exact
                      />
                    ))
                  ) : (
                    <Route
                      key={`${route.key}`}
                      path={`${route.path}`}
                      component={route.component || DefaultComponent}
                      exact
                    />
                  ),
                )}
              </Layout>
            </Switch>
          </Router>
        </ThemeProvider>
      </AppContext.Provider>
    </>
  );
}

export default App;
