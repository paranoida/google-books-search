var React = require('react');
var qwest = require('qwest');

var SearchField = require('./search-field.jsx');
var Items = require('./items.jsx');
var Styles = require('../styles/google-books-search.js');

class GoogleBooksSearch extends React.Component {
  constructor() {
    this.state = {data: []};
  }

  componentDidMount() {
    var query = this.props.query;

    if (query) {
      this.doSearch(query);
    }
  }

  doSearch(query) {
    qwest
      .get('https://www.googleapis.com/books/v1/volumes', {
        "q": query,
        "maxResults": this.props.maxResults,
        "orderBy":  this.props.orderBy,
        "fields": "items(volumeInfo/title,volumeInfo/previewLink,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/imageLinks/smallThumbnail,searchInfo/textSnippet)"
      })
      .then(response => {
        this.setState({
          query: query,
          data: JSON.parse(response).items
        });
      })
      .catch(message => {
        console.log(`Error: ${message}`);
      });
  }

  render() {
    return (
      <div style={Styles.host}>
        <SearchField query={this.state.query} onUserAction={this.doSearch.bind(this)} />
        <Items subtitleMaxLength={this.props.subtitleMaxLength} snippetMaxLength={this.props.snippetMaxLength} data={this.state.data} />
      </div>
    );
  }
}

GoogleBooksSearch.defaultProps = {
  query: '',
  maxResults: '5',
  orderBy: 'relevance',
  subtitleMaxLength: '75',
  snippetMaxLength: '250'
};

module.exports = GoogleBooksSearch;