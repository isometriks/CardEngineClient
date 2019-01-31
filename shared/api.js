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
                withCredentials: true
            };

            if (method === "get") {
                httpConfig.params = data;
            }

            if (method === "post") {
                httpConfig.data = data;
            }

            return axios(httpConfig);
        }
    }
}

const _api = new Api();

_api.addRoute("login", "/login", "post");
_api.addRoute("register", "/register", "post");

_api.addRoute("tableCheck", "/tableCheck", "get");
_api.addRoute("tables", "/tables?game=HighLow", "get");

_api.addRoute("joinMatch", "/joinMatch", "get");
_api.addRoute("leaveMatch", "/leaveMatch", "get");
_api.addRoute("abandonMatch", "/abandonMatch", "get");

export default _api
