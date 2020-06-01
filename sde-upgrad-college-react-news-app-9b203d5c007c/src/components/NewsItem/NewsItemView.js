import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NewsItemStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class NewsItemComponent extends Component {
  constructor(props) {
    super(props)
    this._contentRef = null;
    this.state = {
      url: props.url,
      title: props.title,
      image: props.image,
      author: props.author,
      enableReadMore: true,
      fullHeight: false,
      language: props.language,
      published: props.published,
      description: props.description,
    }
    this.handleReadMore = this.handleReadMore.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      url: nextProps.url,
      title: nextProps.title,
      image: nextProps.image,
      author: nextProps.author,
      language: nextProps.language,
      published: nextProps.published,
      description: nextProps.description,
    })
  }
  handleReadMore() {
    this.setState({
      fullHeight: true,
      enableReadMore: false
    })
  }
  render() {
    const state = this.state;
    return (
      <div className="entry">
        <div className="news-close col flex-center" role="button" onClick={this.props.onClose}>
          <FontAwesomeIcon icon={faTimes} size="xs" />
        </div>
        <div className="title">{state.title}</div>
        <div className="news-author">
          <span>{state.author}</span>
          <span>{state.published}</span>
        </div>
        <div className={`news-content ${state.fullHeight ? "news-content-expand" : ""}`} ref={ele => this._contentRef = ele}>
          {
            state.image !== "None" &&
            <img alt=''
              className="news-pic"
              src={state.image}
            />
          }
          <p className="news-desc">
            {state.description}
            {
              state.url !== "" &&
              <span className="col ref">
                <span><b>Referrence</b></span>
                <a href={state.url}><span>{state.url}</span></a>
              </span>
            }
          </p>
        </div>
        {
          (String(state.description + state.url).length > 600 && state.enableReadMore) &&
          <div className="read-more" role="button" onClick={this.handleReadMore}>
            <span>Read More</span>
          </div>
        }
      </div>
    );
  }
}
NewsItemComponent.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  author: PropTypes.string,
  language: PropTypes.string,
  published: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func.isRequired
}
NewsItemComponent.defaultProps = {
  url: null,
  title: "",
  image: "None",
  author: "",
  language: "",
  published: "",
  description: "",
}
export default NewsItemComponent;
