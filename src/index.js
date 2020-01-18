import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


class BreedSearch extends React.Component {

  renderOption(item, selected) {
    return (
      <option key={item.value} value={item.value}>
        {item.display}
      </option>
    );
  }

  render() {
    let breeds = this.props.breeds
    let handler = this.props.handler;
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
              onChange={ e => handler(e.target.value) }
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
  constructor(props) {
      super(props);
      this.state = {
          selected: '',
      };
      this.BreedChange = this.handleBreedChange.bind(this)
  }

  handleBreedChange(breedID) {
    this.setState({selected: breedID});
  }

  render() {
    return (
      <div className="Home">
        <div className="container">
          <h1>Cat Browser</h1>
          <BreedSearch
            selected={this.state.selected}
            breeds={this.props.breeds}
            handler={this.BreedChange}
          />
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
      };
  }

  componentDidMount() {
    fetch("https://api.thecatapi.com/v1/breeds?limit=3")
      .then(response => {
        return response.json();
      })
      .then(data => {
        let breedsFromApi = data.map((breed) => {
          return {value: breed.id, display: breed.name}
        });
        this.setState({
          breeds: breedsFromApi,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <Home breeds={this.state.breeds}/>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
