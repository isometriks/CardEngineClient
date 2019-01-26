import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import CardApp from './components/CardApp'

ReactDOM.render((
    <BrowserRouter>
        <CardApp />
    </BrowserRouter>
), document.getElementById('app'))
