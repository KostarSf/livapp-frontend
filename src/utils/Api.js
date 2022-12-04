import {Store} from "../storage/Store";

class Api {

  static FetchSystems = (callback, limit = 100) => {
    const key = Store.GetKey();

    fetch(`/api/embeded/system?limit=${limit}&api_key=${key}`)
      .then((r) => r.json())
      .then((r) => {
        callback(r);
      });
  };

  static FetchStatusHistory = (id, callback) => {
    const key = Store.GetKey();

    fetch(`/api/embeded/system/${id}/statuses?api_key=${key}`)
      .then((r) => r.json())
      .then((r) => {
        callback(r);
      });
  };
}

export default Api;
