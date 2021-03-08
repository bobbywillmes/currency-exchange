import React from 'react'
import './App.css';

const Header = () => {
  return (
    <div id="header" className="container-fluid">
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Currency Exchange</span>
      </nav>
    </div>
  )
}

const Footer = () => {
  return (
    <div id="footer" className="container-fluid">
      <div className="row">
        <div className="col">
          Bobby Willmes &copy; 2021
        </div>
      </div>
    </div>
  )
}

class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="main" className="container">
        <div className="row">
          <div className="col">(Currency goes here)</div>
          <div className="col">(converter also might go here)</div>
        </div>
      </div>
    )
  }

}

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
