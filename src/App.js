import React from 'react'
import Chart from 'chart.js'
import '@fortawesome/fontawesome-free/css/all.min.css';
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
          <a href="https://cocky-euler-a69577.netlify.app/" target="_blank" rel="noreferrer">Bobby Willmes</a> &copy; 2021
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
    // console.log(`DropdownFrom handleChange(e)`)
    // console.log(e.target.value)
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <select id="from" onChange={this.handleChange}>
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
    // console.log(`DropdownTo handleChange(e)`)
    // console.log(e.target.value)
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <select id="to" onChange={this.handleChange} value={this.props.to}>
        <option>Select</option>
        {this.props.countries.map((value, index) => {
          return <option key={value} value={value}>{value}</option>
        })}
      </select>
    )
  }
}

class SwapDropdowns extends React.Component {
  render() {
    return (
      <button className="btn btn-outline-dark mt-2"><i className="fas fa-exchange-alt"></i></button>
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
    // console.log(`render NewAmount`)
    return <span>{this.props.newAmount}</span>
  }
}

class RatesTable extends React.Component {
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2">Base: {this.props.base}</th>
          </tr>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.rates).map((key, value) => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{this.props.rates[key]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

class ChartArea extends React.Component {
  // chartRef = React.createRef();

  componentDidMount() {
    this.buildChart()
  }
  componentDidUpdate() {
    this.buildChart()
  }

deleteChart = () => {
  // get the chart element, then its parent
  let chartEl = document.querySelector('#ratesChart')
  let chartContainer = chartEl.parentNode

  // replace with new blank canvas
  let newChart = '<canvas id="ratesChart"></canvas>'
  chartContainer.innerHTML = newChart
}

chartRef = React.createRef();

buildChart = () => {
  // first, delete the old chart (& create a blank canvas)
  this.deleteChart()
  const myChartRef = this.chartRef.current.getContext("2d");
  // set chart options
  Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
  Chart.defaults.global.legend.display = false;
  const {height: graphHeight, width: graphWidth} = myChartRef.canvas;
  // line stroke
  let gradientStroke = myChartRef.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, "#80b6f4");
      gradientStroke.addColorStop(1, "#f49080");
  // line fill underneath
  let gradientFill = myChartRef.createLinearGradient(0, 0, 0, graphHeight);
      gradientFill.addColorStop(0, "rgba(128, 182, 244, 0.1)");
      gradientFill.addColorStop(.5, "rgba(128, 182, 244, 0.5)");
      gradientFill.addColorStop(1, "rgba(255, 255, 255, 1)");
  
  const ctx = document.getElementById('ratesChart').getContext('2d')
  
  new Chart(ctx, {
    type: "line",
    data: {
        labels: this.props.history.chartLabels,
        datasets: [
            {
                label: this.props.from + '/' + this.props.to,
                data: this.props.history.chartData,
                fill: true,
                backgroundColor: gradientFill,
                borderColor: gradientStroke,
                pointBorderColor:          gradientStroke,
                pointBackgroundColor:      gradientStroke,
                pointHoverBackgroundColor: gradientStroke,
                pointHoverBorderColor:     gradientStroke
            }
        ]
    },
    options: {
        responsive: true,
        layout: {
          padding: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 15
          }
        },
        scales: {
          xAxes: [{
              ticks: { display: true },
              gridLines: {
                  display: false,
                  drawBorder: true
              }
          }],
          yAxes: [{
              ticks: { 
                display: true,
                beginAtZero: false
              },
              gridLines: {
                  display: true,
                  drawBorder: true
              },
          }]
        },
        legend: {
          display: true
        },
        // title: {
        //   display: true,
        //   text: 'Rates over Time'
        // },
        animation: {
          easing: 'linear'
        }
      }
    })
}

  render() {
    return (
      <div>
        <h4>Rates Over Time</h4>
        <div id="chartContainer">
          <canvas id="ratesChart" ref={this.chartRef} />
        </div>
        <hr/>
        <div id="ratesOverTimeWrap">
          <table id="ratesOverTime" className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.props.history.rates).map((key, value) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{this.props.history.rates[key][this.props.to]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
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
      to: 'EUR',
      rate: 1,
      rates: [],
      amount: 1,
      newAmount: 1
    }
    this.currencyTo = this.currencyTo.bind(this)
    this.chartRef = React.createRef()
  }

  getCountries() {
    // console.log(`getCountries()`)
    // build countries array from rates object keys {CAD: 1.26, HKD: 7.7, ISK: 123.58} => ['CAD', 'HKD', 'ISK']
    let rates = this.state.response.rates
    let keys = Object.keys(rates)
    this.setState({ countries: keys })
  }

  getData(input = 'USD') {
    console.log(`getData(): ${input}`)
    fetch(`https://api.exchangeratesapi.io/latest?base=${input}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          response: data,
          rates: data.rates
        })
        console.log(this.state)
      })
      .then(() => {
        if(this.state.countries.length === 0) {
          this.getCountries()
        }
      })
      .then(() => {
          this.currencyTo(this.state.to)
          this.getNewAmount()
      })
  }

  getHistory(base = 'USD', symbol = 'AUD') {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    fetch(`https://api.exchangeratesapi.io/history?start_at=${startDate}&end_at=${endDate}&base=${base}&=${symbol}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error)
        }
        console.log(`getHistory(${base}, ${symbol})`)
        console.log(data)
        
        // data returned as a JSON object with properties as dates, each date has sub object with currencies as properties
        //  { 2012-03-21: {CAD: 1.26, HKD: 7.75}, 2012-03-22: {CAD: 1.25, HKD: 7.73} }

        // sort the object's properties (dates)
        function sortObjectByKeys(o) {
          return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
        }
        let sortedData = sortObjectByKeys(data.rates)
        console.log(sortedData)

        // convert API data into chart-ready data
        // chartLabels: ['2021-03-21', '2021-03-22'] & chartData: [1.26, 1.25]
        const chartLabels = Object.keys(sortedData)
        const chartData = Object.values(sortedData).map(rate => rate[symbol])

        let newData = {}
        newData.rates = sortedData
        newData.chartLabels = chartLabels
        newData.chartData = chartData
        console.log(newData)
        this.setState({
          history: newData
        })
      })
      .catch(error => console.error(error.message))
  }

  getNewAmount(val = this.state.amount) {
    console.log(`getNewAmount() val: ${val} rate: ${this.state.rate}`)
    // get newAmount by val * rate
    let newAmount = val * this.state.rate
    // console.log(`${val} * ${this.state.rate} = ${newAmount}`)
    // setState of newAmount
    this.setState({ newAmount: newAmount })
  }

  // do stuff when To dropdown is selected
  currencyTo(value) {
    // console.log(`currencyTo() ---`)
    // console.log(value)

    // if selected 'To' option is 'Select Currency', reset State of 'to', 'rate' & 'newAmount' then return early
    if (value === 'Select Currency') {
      // console.log(`dropdown selected Select Currency`)
      this.setState({ to: undefined, rate: undefined, newAmount: undefined })
      return
    }

    let rates = this.state.response.rates
    // loop through rates obj to find match (HKD: 7.76)
    Object.keys(rates).forEach(key => {
      if (key === value) {
        // console.log(`found a match`)
        // console.log(key + ': ' + rates[key])
        let to = key
        let newRate = rates[key]
        // set state (to: HKD, rate: 7.76)
        this.setState({ to: to })
        this.setState({ rate: newRate })

        // get newAmount & set state
        let newAmount = newRate * this.state.amount
        this.setState({ newAmount: newAmount })
      }
    })
  }

  componentDidMount() {
    this.getData()
    this.getHistory(this.state.from, this.state.to)
  }

  componentDidUpdate() {
    // console.log(this.state)
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
    // consolese.log(val)
    this.setState({ to: val })
    this.currencyTo(val)
    this.getHistory(this.state.from, val)
  }

  // do stuff when From is changed
  updateFrom = val => {
    console.log(`updateFrom()`)
    console.log(val)
    this.setState({ from: val })
    this.getData(val)
    this.getHistory(val, this.state.to)
    // reset scroll position of rates table
    let ratesTable = document.getElementById('ratesTableWrap')
    ratesTable.scrollTop = 0
  }

  // do stuff when Swap button is clicked
  swap = () => {
    console.log(`swap() -----`)
    // get the old states & swap them
    let newFrom = this.state.to
    let newTo = this.state.from
    // assign the new States
    this.setState({ from: newFrom })
    this.setState({ to: newTo })
    // get dropdown elements & update their selection
    let fromEl = document.getElementById('from')
    let toEl = document.getElementById('to')
    fromEl.value = newFrom
    toEl.value = newTo
    // reset scroll position of rates table
    let ratesTable = document.getElementById('ratesTableWrap')
    ratesTable.scrollTop = 0
    this.getData(newFrom)
    // this.updateFrom(newFrom)
    this.currencyTo(newTo)
    this.getHistory(newFrom, newTo)
  }

  render() {
    return (
      <div id="main" className="container">
        <div className="row">
          <div className="col-12 col-md-2">
            <div className="title">Amount</div>
            <InputAmount onChange={this.updateAmount}></InputAmount>
          </div>
          <div className="col-4 col-md-2">
            <div className="title">From</div>
            <DropdownFrom countries={this.state.countries} onChange={this.updateFrom}></DropdownFrom>
          </div>
          <div className="col-4 col-md-2">
            <span onClick={this.swap}>
              <SwapDropdowns></SwapDropdowns>
            </span>
          </div>
          <div className="col-4 col-md-2">
            <div className="title">To</div>
            <DropdownTo countries={this.state.countries} to={this.state.to} onChange={this.updateTo}></DropdownTo>
          </div>
          <div className="col-12 col-md-2">
            <div className="title">Rate</div>
            <Rate from={this.state.from} to={this.state.to} rate={this.state.rate}></Rate>
          </div>
          <div className="col-12 col-md-2">
            <div className="title">New Amount</div>
            <NewAmount newAmount={this.state.newAmount}></NewAmount>
          </div>
        </div>
        <br />
        <div className="row">
          <div id="ratesTableWrap" className="col-12 col-md-5 mx-auto">
            <RatesTable base={this.state.from} rates={this.state.rates}></RatesTable>
          </div>
          <div className="col-12 col-md-5">
            {this.state && this.state.history  &&
              <div>
                {/* {'This should render after API call'} */}
                <ChartArea history={this.state.history} from={this.state.from} to={this.state.to}></ChartArea>
              </div>
            }
            
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
