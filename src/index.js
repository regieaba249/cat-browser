import React from 'react';
import ReactDOM from 'react-dom';


class BreedSearch extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          breeds: [],
      };
  }

  componentDidMount() {
    fetch("https://api.thecatapi.com/v1/breeds")
      .then(response => {
        return response.json();
      })
      .then(data => {
        let breedsFromApi = data.map((breed) => {
          return {value: breed.id, display: breed.name}
        });
        this.setState({
          breeds: breedsFromApi
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <select>
          <option key='' value=''>Select breed</option>
          {this.state.breeds.map((item) => <option key={item.value} value={item.value}>{item.display}</option>)}
        </select>
      </div>
    )
  }
}

function CatBreedSearch(props) {
  return (
      <div className="cat-browser">
        <h1>Cat Browserssss</h1>
        <BreedSearch />
      </div>
    );
}

// ========================================

ReactDOM.render(
  <CatBreedSearch />,
  document.getElementById('root')
);
