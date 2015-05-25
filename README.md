# react-photo-swiper
Photo swiper based on (http://www.idangero.us/swiper)

## Installation

```bash
npm install react-photo-swiper
```

## Usage

```javascript
var React = require('react')
var ReactSwiper = require('react-photo-swiper')

var Carousel = React.createClass({
    render: function () {
        return (
            <ReactPhotoSwiper
                simulateTouch={true}
            >
                <div>'PANE 1'</div>
                <div>'PANE 2'</div>
                <div>'PANE 3'</div>
            </ReactSwipe>
        );
    }
});

React.render(<Carousel />, document.body)
```

**MIT Licensed**
