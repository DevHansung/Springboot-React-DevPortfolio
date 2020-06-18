import { API_BASE_URL, ACCESS_TOKEN } from '../constants/Property';

//////////Request API//////////
//Basic request
const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        ).catch((error) => {
            console.log(error.message)
        })
};

//Delete request
const deleteRequest = (options) => {
    const headers = new Headers()
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
}

//File upload request
const multipartRequest = (options) => {
    const headers = new Headers({
    })
    if (sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }
    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    /* response message 받는 부분 */
                    return Promise.reject(json);
                }
                return json;
            })
        );
};
//////////Request API end//////////

/////main info start/////
export function loadInformation(username) {
    return request({
        url: API_BASE_URL + "/information/" + username,
        method: 'GET'
    });
}

export function loadInformationById(infoId) {
    return request({
        url: API_BASE_URL + "/informationid/" + infoId,
        method: 'GET'
    });
}

export function uploadInformation(username, title, summary, text, name, email, github) {
    const data = {
        "username": username,
        "title": title,
        "text": text,
        "summary": summary,
        "name": name,
        "email": email,
        "github": github
    }
    return request({
        url: API_BASE_URL + "/information",
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function editInformation(infoId, title, summary, text, name, email, github) {
    const data = {
        "title": title,
        "text": text,
        "summary": summary,
        "name": name,
        "email": email,
        "github": github
    }
    return request({
        url: API_BASE_URL + "/information/" + infoId,
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export function deleteInformation(infoId) {
    return deleteRequest({
        url: API_BASE_URL + "/information/" + infoId,
        method: 'DELETE'
    });
}
/////main info end/////

/////about start/////
export function loadAbout(username) {
    return request({
        url: API_BASE_URL + "/about/" + username,
        method: 'GET'
    });
}

export function loadAboutById(aboutId) {
    return request({
        url: API_BASE_URL + "/aboutid/" + aboutId,
        method: 'GET'
    });
}

export function uploadAbout(username, text, favorite, fileList) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('text', text);
    formData.append('favorite', favorite);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/about",
        method: 'POST',
        body: formData
    })
}

export function editAboutImage(aboutId, text, favorite, fileList) {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('favorite', favorite);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/aboutimage/" + aboutId,
        method: 'PUT',
        body: formData
    })
}

export function editAbout(aboutId, text, favorite) {
    const data = {
        "text": text,
        "favorite": favorite,
    }
    return request({
        url: API_BASE_URL + "/about/" + aboutId,
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export function deleteAbout(aboutId) {
    return deleteRequest({
        url: API_BASE_URL + "/about/" + aboutId,
        method: 'DELETE'
    });
}
/////about end/////

/////skill start/////
export function loadSkill(username) {
    return request({
        url: API_BASE_URL + "/skill/" + username,
        method: 'GET'
    });
}

export function uploadSkill(username, title, level, categoty, fileList) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('title', title);
    formData.append('level', level);
    formData.append('categoty', categoty);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/skill",
        method: 'POST',
        body: formData
    })
}

export function deleteSkill(skillId) {
    return deleteRequest({
        url: API_BASE_URL + "/skill/" + skillId,
        method: 'DELETE'
    });
}
/////skill end/////

/////portfolio start/////
export function loadPortfolio(username) {
    return request({
        url: API_BASE_URL + "/portfolio/" + username,
        method: 'GET'
    });
}

export function loadPortfolioById(portfolioId) {
    return request({
        url: API_BASE_URL + "/portfolioid/" + portfolioId,
        method: 'GET'
    });
}

export function uploadPortfolio(username, title, summary, period, technology, github, fileList) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('period', period);
    formData.append('technology', technology);
    formData.append('github', github);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/portfolio",
        method: 'POST',
        body: formData
    })
}

export function editPortfolioImage(portfolioId, title, summary, period, technology, github, fileList) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('period', period);
    formData.append('technology', technology);
    formData.append('github', github);
    formData.append('image', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/portfolioimage/" + portfolioId,
        method: 'PUT',
        body: formData
    })
}

export function editPortfolio(portfolioId, title, summary, period, technology, github) {
    const data = {
        "title": title,
        "period": period,
        "summary": summary,
        "technology": technology,
        "github" : github
    }
    return request({
        url: API_BASE_URL + "/portfolio/" + portfolioId,
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export function deletePortfolio(portfolioId) {
    return deleteRequest({
        url: API_BASE_URL + "/portfolio/" + portfolioId,
        method: 'DELETE'
    });
}
/////portfolio end/////

/////portfolioPDF start/////
export function loadPortfolioPdf(username) {
    return request({
        url: API_BASE_URL + "/portfoliopdf/" + username,
        method: 'GET'
    });
}

export function uploadPortfolioPdf(username, fileList) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('pdf', fileList);
    return multipartRequest({
        url: API_BASE_URL + "/portfoliopdf",
        method: 'POST',
        body: formData
    })
}

export function deletePortfolioPdf(pdfId) {
    return deleteRequest({
        url: API_BASE_URL + "/portfoliopdf/" + pdfId,
        method: 'DELETE'
    });
}

export function deletePortfolioByUsername(username) {
    return deleteRequest({
        url: API_BASE_URL + "/deleteall/" + username,
        method: 'DELETE'
    });
}
/////portfolioPDF end/////

/////portfolioLike start/////
export function loadLikesByUsername(username) {
    return request({
        url: API_BASE_URL + "/loadlikes/" + username,
        method: 'GET'
    });
}

export function countLikeByInfo(infoId) {
    return request({
        url: API_BASE_URL + "/countlike/" + infoId,
        method: 'GET'
    });
}

export function loadLikeByUsername(infoId, username) {
    return request({
        url: API_BASE_URL + "/loadlike/" + infoId + "/" + username,
        method: 'GET'
    });
}

export function uploadLikeByUsername(infoId, username) {
    const data = {
        "username": username
    }
    return request({
        url: API_BASE_URL + "/like/" + infoId,
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function deleteLikeByLikeId(likeId) {
    return request({
        url: API_BASE_URL + "/like/" + likeId,
        method: 'DELETE'
    });
}
/////portfolioLike end/////

/////getAllPortfolio/////
export function getAllPortfolio() {
    return request({
        url: API_BASE_URL + "/allportfolio",
        method: 'GET'
    });
}

