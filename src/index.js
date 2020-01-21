import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import axios from 'axios';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.baseURL = 'https://api.thecatapi.com';
axios.defaults.headers.common["x-api-key"] = "a35b8e1a-ea47-4a8a-9acf-00d9934c728c";


function CatDetails(props) {
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

function CatThumbnail(props) {
  if (props.cats.length === 0) {
    return (
      <div className="row">
        <div className="col-md-3 col-sm-6 col-12">
          {props.loading ? "Loading Cats..." : "No cats available" }
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {props.cats.map((cat) => {
        return (
          <div className="col-md-3 col-sm-6 col-12" key={cat.id}>
            <div className="card">
              <img className="card-img-top" src={cat.url} alt={cat.id}/>
              <div className="card-body">
                <Link
                  to={`/${cat.id}`}
                  onClick={() => props.detailHandler(cat)}
                  className="btn btn-primary btn-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

class Cats extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        cats: [],
        page: 0,
        more: true,
        loading: false,
      };
  }

  fetchCats() {
    if (this.props.selected.length) {
      let params = {
        "breed_id": this.props.selected,
        "limit": 10,
        "order": "ASC",
        "page": this.state.page
      }
      this.setState({ loading: true }, () => {
        axios.get(`/v1/images/search`, { params })
          .then(response => {
            let cats = response.data.map((cat) => { return cat });
            let newArray = this.state.cats.slice();
            let update = { cats: newArray.concat(cats), loading: false }
            if (cats.length < 10) {
              update.more = false
              update.page = 0
            } else {
              update.page = params.page + 1
            }
            this.setState((state) => update);
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }

  componentDidMount() {
    this.fetchCats();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.setState({
        cats: [],
        page: 0,
        more: true,
      }, () => {this.fetchCats()});
    }
  }

  renderLoadMore() {
    if (this.state.more && this.state.cats.length) {
      return (
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={() => this.fetchCats()}
          >
            {this.state.loading ? "Loading Cats..." : "Load more" }
          </button>
      )
    }
  }

  render() {
    return (
      <div className="Cats">
        <CatThumbnail
          cats={this.state.cats}
          detailHandler={this.props.detailHandler}
          loading={this.state.loading}
        />
        <div className="row justify-content-center">
          <div className="col-md-4 col-sm-6 col-12">
            {this.renderLoadMore()}
          </div>
        </div>
      </div>
    );
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
    return (
      <div className="row">
        <div className="col-5">
          <div className="form-group row">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Breed</label>
            <div className="col-sm-10">
              <select
                id="breed"
                className="form-control"
                disabled={this.props.breeds.length === 0}
                onChange={ e => this.props.breedHandler(e.target.value) }
                value={this.props.selected}
              >
                <option key='' value=''>Select breed</option>
                {this.props.breeds.map((item) => this.renderOption(item))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Home(props) {
  let selected = props.selected
  let breeds = props.breeds
  let breedHandler = props.breedHandler
  let detailHandler = props.detailHandler
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
    axios.get(`/v1/breeds`)
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
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path={`/${this.state.catDetails.id}`}>
              <CatDetails details={this.state.catDetails}/>
            </Route>
            <Route path="/">
              <Home
                selected={ this.state.selected }
                breeds={ this.state.breeds }
                breedHandler={ this.handleBreedChange }
                detailHandler={ this.handleDetail }
              />
            </Route>
          </Switch>
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
