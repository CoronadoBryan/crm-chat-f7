import config from './config.js';
import moment from 'moment';

const tools = {
    isJSON: function (jsonString) {
        if (!!jsonString && typeof jsonString === "object") {
            return jsonString;
        }

        try {
            let obj = JSON.parse(jsonString);

            if (obj && typeof obj === "object") {
                return obj;
            }
        } catch (e) {
        }

        return false;
    },
    sendRequest: function (method, uri, data) {
        try {
            (!method) && (method = 'GET');
            (!uri) && (uri = '');
            let token = localStorage.getItem('token');
            let body = null;

            if (String(uri).length === 0) {
                throw new Error('El URI no puede ser vacio.');
            }

            if ((data = this.isJSON(data)) !== false) {
                body = JSON.stringify(data);
            }

            if (!token) {
                throw new Error('El TOKEN no existe.');
            }

            let request = new Request(config.endpoint(uri), {
                method: method,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }),
                body: body
            });

            let peticion = fetch(request).then((response) => {
                return response.json();
            });

            return peticion;
        } catch (ex) {
            console.error('sendRequest', ex.message);
            return Promise.reject(ex);
        }
    },
    parseJwt: function (token) {
        try {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('parseJwt', e);
        }

        return false;
    },
    addRoutes: function (routes_base, routes_new) {
        let nuevos = routes_new.filter((route) => {
            let existe = routes_base.find(({path}) => {
                return path === route['path'];
            });

            return !this.isJSON(existe);
        });

        nuevos.map((route) => {
            routes_base.push(route);
        });
    },
    getDocumentos: function(){
        return this.sendRequest('GET', '/documento/listado').then((response) => {
            if (response && response.success == true) {
                return response.data;
            }
        });
    },
    getDatabyDocument: function (documento) {
        return this.sendRequest('GET', `/usuario/buscar/${documento}`)
            .then(response => {
                if (response.success == true) {
                    return response.data;
                }else {
                    return null
                }
            });
    },
    moment
};

export default tools;