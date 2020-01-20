import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.baseURL = 'https://api.thecatapi.com';
axios.defaults.headers.common["x-api-key"] = "a35b8e1a-ea47-4a8a-9acf-00d9934c728c";


function Cat(props) {
  let details = props.details
  return (
    <div className="Cat">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <Link to="/" className="btn btn-primary">Back</Link>
          </div>
          <img className="card-img-top" src={details.url} alt={details.id}/>
          <div className="card-body">
            <h4>{details.name}</h4>
            <h5>Origin: {details.origin}</h5>
            <h6>{details.temperament}</h6>
            <p>{details.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

class Cats extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        cats: [],
      };
  }

  fetchCats() {
    let selected = this.props.selected;
    if (selected.length) {
      const params = {
        "breed_id": selected,
        "limit": 10,
        "page": 1,
        "order": "ASC"
      }
      axios.get(`/v1/images/search`, { params })
        .then(response => {
          let cats = response.data.map((cat) => {
            return cat
          });
          this.setState({ cats });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    console.log('Cats - componentDidMount');
    this.fetchCats();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.selected !== prevProps.selected) {
      this.fetchCats();
    }
  }

  renderCats(cat) {
    const logo = cat.url
    let detailHandler = this.props.detailHandler
    return (
      <div className="col-md-3 col-sm-6 col-12" key={cat.id}>
        <div className="card">
          <img className="card-img-top" src={logo} alt={cat.id}/>
          <div className="card-body">
            <Link
              to={`/${cat.id}`}
              onClick={() => detailHandler(cat)}
              className="btn btn-primary btn-block"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let cats = this.state.cats;
    if (cats.length) {
      return (
        <div className="row">
          {cats.map((cat) => this.renderCats(cat))}
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-12">No cats available</div>
        </div>
      );
    }
  }
}

class Breed extends React.Component {

  renderOption(item, selected) {
    return (
      <option key={item.value} value={item.value}>
        {item.display}
      </option>
    );
  }

  render() {
    let breeds = this.props.breeds
    let breedHandler = this.props.breedHandler;
    let selected = this.props.selected;

    return (
      <div className="row">
        <div className="col-md-3 col-sm-6 col-12">
          <div className="form-group">
            <label className="form-label" htmlFor="breed">Breed</label>
            <select
              id="breed"
              className="form-control"
              disabled={breeds.length === 0}
              onChange={ e => breedHandler(e.target.value) }
              value={selected}
            >
              <option key='' value=''>Select breed</option>
              {breeds.map((item) => this.renderOption(item))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

class Home extends React.Component {

  render() {
    let selected = this.props.selected
    let breeds = this.props.breeds
    let breedHandler = this.props.breedHandler
    let detailHandler = this.props.detailHandler
    return (
      <div className="Home">
        <div className="container">
          <h1>Cat Browser</h1>
          <Breed
            selected={ selected }
            breeds={ breeds }
            breedHandler={ breedHandler }
          />
          <Cats detailHandler={detailHandler} selected={ selected }/>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        breeds: [],
        selected: '',
        catDetails: {},
      };
      this.handleBreedChange = this.handleBreedChange.bind(this)
      this.handleDetail = this.handleDetail.bind(this)
  }

  handleBreedChange(selected) {
    this.setState({ selected });
  }

  handleDetail(catDetails) {
    this.setState({catDetails: {
      name: catDetails.breeds[0].name,
      id: catDetails.id,
      url: catDetails.url,
      origin: catDetails.breeds[0].origin,
      temperament: catDetails.breeds[0].temperament,
      description: catDetails.breeds[0].description,
    }});
  }

  componentDidMount() {
    const params = {"limit": 10}
    axios.get(`/v1/breeds`, { params })
      .then(response => {
        let breeds = response.data.map((breed) => {
          return {value: breed.id, display: breed.name}
        });
        this.setState({ breeds });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let breedHandler = this.handleBreedChange
    let detailHandler = this.handleDetail
    let selected = this.state.selected
    let catId = this.state.catDetails.id
    let catDetails = this.state.catDetails
    return (
      <div className="App">
        <Router>
          <div>
            <Switch>
              <Route path={`/${catId}`}>
                <Cat details={catDetails}/>
              </Route>
              <Route path="/">
                <Home
                  selected={ selected }
                  breeds={ this.state.breeds }
                  breedHandler={ breedHandler }
                  detailHandler={ detailHandler }
                />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
