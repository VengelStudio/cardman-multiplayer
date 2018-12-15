import React, { Component } from 'react';

class Popup extends Component {
  constructor(props) {
    super(props);
    this.bRadius = '0.5vw';
    this.roundedBottomStyle = { borderBottomLeftRadius: this.bRadius, borderBottomRightRadius: this.bRadius };
    this.roundedTopStyle = {
      borderTopLeftRadius: this.bRadius,
      borderTopRightRadius: this.bRadius
    };
    this.popupStyle = {
      ...this.roundedTopStyle,
      ...this.roundedBottomStyle
    };
  }

  render() {
    return (
      <div
        style={this.popupStyle}
        className='container of-rows text-nunito bg-khaki popup center-absolute-both d-block p-absolute popup-upper-round popup-bottom-round'
      >
        <div
          style={this.roundedTopStyle}
          className='padding-sm popup-title row width-auto semi-bold text-lg bg-blue color-light text-center'
        >
          <span dangerouslySetInnerHTML={{ __html: this.props.title }} />
          <button
            onClick={() => {
              this.props.onClose(this.props.id);
            }}
            className='btn-popup-close'
          >
            <span className='fas margin-auto d-block fa-window-close' />
          </button>
        </div>
        <div
          className='row width-full height-full popup-content padding-sm text-md'
          dangerouslySetInnerHTML={{ __html: this.props.content }}
        />
      </div>
    );
  }
}

export default Popup;
