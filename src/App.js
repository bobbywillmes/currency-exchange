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

class InputAmount extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange(e) {
    // console.log(`InputAmount handleChange(e)`)
    let number = parseInt(e.target.value)
    this.props.onChange(number)
  }

  render() {
    return <input id="amount" type="number" min="0" defaultValue="1" onChange={this.handleChange} />
  }
}

class DropdownFrom extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    console.log(`DropdownFrom handleChange(e)`)
    console.log(e.target.value)
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <select onChange={this.handleChange}>
        <option>USD</option>
        {this.props.countries.map((value, index) => {
          return <option key={value}>{value}</option>
        })}
      </select>
    )
  }
}

class DropdownTo extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    console.log(`DropdownTo handleChange(e)`)
    console.log(e.target.value)
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <select onChange={this.handleChange}>
        <option>Select Currency</option>
        {this.props.countries.map((value, index) => {
          return <option key={value}>{value}</option>
        })}
      </select>
    )
  }
}

class Rate extends React.Component {
  render() {
    return (
      <span>1 {this.props.from} = {this.props.rate} {this.props.to}</span>
    )
  }
}

class NewAmount extends React.Component {
  render() {
    console.log(`render NewAmount`)
    const { newAmount } = this.props
    return <span>{newAmount}</span>
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
      rate: 1,
      amount: 1,
      newAmount: 1
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

  getData(input = 'USD') {
    console.log(`getData()`)
    fetch(`https://api.exchangeratesapi.io/latest?base=${input}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ response: data })
      })
      .then(() => {
        this.getCountries()
      })
  }

  getNewAmount(val) {
    console.log(`getNewAmount()`)
    // get newAmount by val * rate
    let newAmount = val * this.state.rate
    console.log(`${val} * ${this.state.rate} = ${newAmount}`)
    // setState of newAmount
    this.setState({ newAmount: newAmount })
    console.log(this.state)
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
    // this.getNewAmount(this.state.amount)
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    console.log(this.state)
    this.render()
  }

  // do stuff when Amount is changed
  updateAmount = val => {
    // console.log(`updateAmount`)
    this.setState({ amount: val })
    this.getNewAmount(val)
  }

  // do stuff when To is changed
  updateTo = val => {
    console.log(`updateTo`)
    console.log(val)
    this.setState({ to: val })
    this.currencyTo(val)
    this.getNewAmount(this.state.amount)
  }

  // do stuff when From is changed
  updateFrom = val => {
    console.log(`updateFrom()`)
    console.log(val)
    this.setState({ from: val })
    this.getData(val)
    this.getNewAmount(this.state.amount)
  }

  render() {
    return (
      <div id="main" className="container">
        <div className="row">
          <div className="col">Amount</div>
          <div className="col">From</div>
          <div className="col">To</div>
          <div className="col">Rate</div>
          <div className="col">New Amount</div>
        </div>
        <div className="row">
          <div className="col">
            <InputAmount onChange={this.updateAmount}></InputAmount>
          </div>
          <div className="col">
            <DropdownFrom countries={this.state.countries} onChange={this.updateFrom}></DropdownFrom>
          </div>
          <div className="col">
            <DropdownTo countries={this.state.countries} onChange={this.updateTo}></DropdownTo>
          </div>
          <div className="col">
            <Rate from={this.state.from} to={this.state.to} rate={this.state.rate}></Rate>
          </div>
          <div className="col">
            <NewAmount newAmount={this.state.newAmount} amount={this.state.amount} rate={this.state.rate}></NewAmount>
          </div>
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
