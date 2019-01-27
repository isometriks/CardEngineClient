import axios from 'axios';

import config from './config';

class Api {
    constructor () {
        this.routes = {};
    }

    addRoute (name, url, method) {
        this[name] = (data) => {
            let httpConfig = {
                url: `${config.apiHost}${url}`,
                method: method,
                withCredentials: true,
                data: data
            };

            return axios(httpConfig);
        }
    }
}

const _api = new Api();

_api.addRoute("login", "/login", "post");
_api.addRoute("register", "/register", "post");

_api.addRoute("tables", "/tables?game=HighLow", "get");

export default _api
