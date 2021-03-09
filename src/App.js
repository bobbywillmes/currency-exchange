import React from 'react'
import './App.css';

const Header = () => {
  return (
    <div id="header" className="container-fluid">
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">Currency Exchange</span>
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
    super(props);
    this.state = {
      response: {},
      countries: []
    }
  }

  getCountries() {
    // console.log(`getCountries()`)
    let rates = this.state.response.rates
    let keys = Object.keys(rates)
    this.setState({ countries: keys })
    console.log(this.state)
  }

  getData() {
    fetch(`https://api.exchangeratesapi.io/latest?base=USD`)
      .then(res => res.json())
      .then(data => {
        this.setState({ response: data })
      })
      .then(() => {
        this.getCountries()
      })
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    return (
      <div id="main" className="container">
        <div className="row">
          <div className="col">Amount</div>
          <div className="col">From</div>
          <div className="col">To</div>
          <div className="col">New Amount</div>
        </div>
        <div className="row">
          <div className="col">1</div>
          <div className="col">USD</div>
          <div className="col">
            <select id="" className="form-select">
              <option>Select Currency</option>
              {this.state.countries.map((value, index) => {
                return <option key={value}>{value}</option>
              })}
            </select>
          </div>
          <div className="col">0.84</div>
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
