import React, { Component } from 'react';
import "./Home.css";
import AppLogo from "../../assets/logo.svg";
import Languages from "../../assets/languages.json";
import Countries from "../../assets/countries.json";
import { getFilterNews, getLatestNews, dateString } from "../../utils/helper";
import NewsItem from "../../components/NewsItem";

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      language: "",
      country: "",
      startDate: "",
      endDate: "",
      news: null,
      loadingText: "Getting Latest News",
      errorText: ""
    }
    this.speaks = React.createRef();
    this.handleNewsError = this.handleNewsError.bind(this);
    this.handleNewsClose = this.handleNewsClose.bind(this);
    this.handleFilterNews = this.handleFilterNews.bind(this);
    this.handleLatestNews = this.handleLatestNews.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleNewsResponse = this.handleNewsResponse.bind(this);
    this.handleInputFromDate = this.handleInputFromDate.bind(this);
  }
  componentDidMount() {
    this.handleLatestNews()
  }
  handleNewsResponse(res) {
    if (res.status === 200) {
      let newsJson = JSON.parse(res.response);
      console.log(newsJson);
      if (newsJson.status === "ok") {
        this.setState({
          news: newsJson.news
        })
      } else {
        this.setState({
          news: [],
          errorText: "Unable To Process your request"
        })
      }
    } else if (res.status === 429) {
      this.setState({
        news: [],
        errorText: "Too Many Request"
      })
    } else {
      this.setState({
        news: [],
        errorText: "Unable To Process your request"
      })
    }
  }
  handleNewsError(err) {
    console.log(err);
    this.setState({
      news: [],
      errorText: "Unable To Process your request"
    })
  }
  handleLatestNews() {
    this.setState({
      news: null,
      loadingText: "Getting Latest News"
    }, () => {
      getLatestNews().then(this.handleNewsResponse).catch(this.handleNewsError)
    })
  }
  handleFilterNews() {
    const { startDate, endDate, language, country } = this.state;
    this.setState({
      news: null,
      loadingText: "Getting your News"
    }, () => {
      getFilterNews(language, country, startDate, endDate).then(this.handleNewsResponse).catch(this.handleNewsError)
    })
  }
  handleFilterReset() {
    this.setState({
      startDate: "",
      endDate: "",
      language: "",
      country: ""
    })
  }
  handleNewsClose(index) {
    let { news } = this.state
    news.splice(index, 1)
    this.setState({
      news,
      errorText: "No News to Show"
    })
  }
  handleInputFromDate(event) {
    let { endDate } = this.state;
    if (endDate !== "") {
      let eventDate = new Date(event.nativeEvent.target.value);
      let endDateObj = new Date(endDate);
      eventDate.setHours(0, 0, 0, 0);
      endDateObj.setHours(0, 0, 0, 0)
      endDate = eventDate > endDateObj ? "" : endDate;
    }
    this.setState({
      endDate: endDate,
      startDate: event.nativeEvent.target.value
    })
  }
  render() {
    const state = this.state;
    return (
      <div className="col app">
        <nav className="header col">
          <div className="header-inner row space-btn">
            <button className="btn-latest" onClick={this.handleLatestNews}>
              Show Latest News
            </button>
          </div>
        </nav>
        <div className="col container">
          <div className="wraper row">
            <div className="col filer-view">
              <div className="row space-btn filter-header">
                <div className="filter-title">Filter News</div>
                <div className="filter-reset" role="button" onClick={this.handleFilterReset}><span>Reset</span> </div>
              </div>
              <div className="filter-form col">
                <div className="col filter-box">
                  <span className="input-label">Language</span>
                  <select
                    className="filter-input"
                    value={state.language}
                    onChange={event => this.setState({ language: event.nativeEvent.target.value })}>
                    <option value="" disabled hidden>Select</option>
                    {
                      Languages.map(lang => {
                        return (
                          <option value={lang.code} key={lang.code}>{lang.fullName}</option>
                        )
                      })
                    }
                  </select>
                </div>
                <div className="col filter-box">
                  <span className="input-label">Country</span>
                  <select
                    className="filter-input"
                    value={state.country}
                    onChange={event => this.setState({ country: event.nativeEvent.target.value })}>
                    <option value="" disabled hidden>Select</option>
                    {
                      Countries.map((country, index) => {
                        return (
                          <option value={country.code} key={index}>{country.fullName}</option>
                        )
                      })
                    }
                  </select>
                </div>
                <div className="col filter-box">
                  <span className="input-label">Start Date</span>
                  <input
                    type="date"
                    name="startDate"
                    className="filter-input"
                    placeholder="Start Date"
                    value={state.startDate}
                    onChange={this.handleInputFromDate} />
                </div>
                <div className="col filter-box">
                  <span className="input-label">End Date</span>
                  <input
                    type="date"
                    name="endDate"
                    className="filter-input"
                    placeholder="End Date"
                    value={state.endDate}
                    min={state.startDate === "" ? null : dateString(state.startDate)}
                    onChange={event => this.setState({ endDate: event.nativeEvent.target.value })} />
                </div>
                <button
                  className="filter-btn"
                  onClick={this.handleFilterNews}
                  disabled={state.startDate === "" && state.language === "" && state.country === "" && state.endDate === ""} >
                  <span>Show News</span>
                </button>
              </div>
            </div>
            <div className={`col news-view ${state.news === null || (state.news !== null && state.news.length === 0) ? "news-view-null" : ""}`} >
              {
                state.news == null
                  ?
                  <div className="col flex-center" style={{ flex: 1 }}>
                    <div className="activity-indicator"></div>
                    <div className="indicator-text">{state.loadingText}</div>
                  </div>
                  : (state.news !== null && state.news.length === 0) ?
                    <div className="col flex-center" style={{ flex: 1 }}>
                      <div className="indicator-text">{state.errorText}</div>
                    </div>
                    :
                    <div className="col">
                      {
                        state.news.map((newsItem, index) => {
                          return (
                            <NewsItem
                              key={index}
                              index={index}
                              url={newsItem.url}
                              title={newsItem.title}
                              image={newsItem.image}
                              author={newsItem.author}
                              language={newsItem.language}
                              published={newsItem.published}
                              description={newsItem.description}
                              onClose={() => this.handleNewsClose(index)}
                            />
                          )
                        })
                      }
                    </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
