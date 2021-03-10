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

class Rate extends React.Component {
  render() {
    return (
      <span>1 {this.props.from} = {this.props.rate} {this.props.to}</span>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      countries: [],
      from: 'USD',
      to: '',
      rate: 1
    }
    this.currencyTo = this.currencyTo.bind(this)
  }

  getCountries() {
    // console.log(`getCountries()`)
    // build countries array from rates object keys {CAD: 1.26, HKD: 7.7, ISK: 123.58} => ['CAD', 'HKD', 'ISK']
    let rates = this.state.response.rates
    let keys = Object.keys(rates)
    this.setState({ countries: keys })
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

  // do stuff when To dropdown is selected
  currencyTo(value) {
    // console.log(`currencyTo() ---`)
    // console.log(value)

    // if selected 'To' option is 'Select Currency', reset State of 'to' & 'rate' then return early
    if(value === 'Select Currency') {
      console.log(`dropdown selected Select Currency`)
      this.setState({ to: undefined, rate: undefined })
      return
    }
    // set the 'to' value (HKD)
    this.setState({to: value})
    let rates = this.state.response.rates
    // loop through rates obj to find match (HKD: 7.76)
    Object.keys(rates).forEach(key => {
      if(key === value) {
        // console.log(`found a match`)
        // console.log(key + ': ' + rates[key])
        let to = key
        let rate = rates[key]
        // set state (to: HKD, rate: 7.76)
        this.setState({ to: to })
        this.setState({ rate: rate })
      }
    })
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  render() {
    return (
      <div id="main" className="container">
        <div className="row">
          <div className="col">Amount</div>
          <div className="col">From</div>
          <div className="col">To</div>
          <div className="col">Rate</div>
        </div>
        <div className="row">
          <div className="col">1</div>
          <div className="col">USD</div>
          <div className="col">
            <select id="to" className="form-select" onChange={(e) => this.currencyTo(e.target.value)}>
              <option>Select Currency</option>
              {this.state.countries.map((value, index) => {
                return <option key={value}>{value}</option>
              })}
            </select>
          </div>
          <div className="col"><Rate from={this.state.from} to={this.state.to} rate={this.state.rate}></Rate></div>
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
