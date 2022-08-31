class Api {

  static FetchSystems = (callback, limit = 100, key = "fab7b608") => {
    fetch(`/api/embeded/system?limit=${limit}&api_key=${key}`)
      .then((r) => r.json())
      .then((r) => {
        callback(r);
      });
  };

  static FetchStatusHistory = (id, callback, key = "fab7b608") => {
    fetch(`/api/embeded/system/${id}/statuses?api_key=${key}`)
      .then((r) => r.json())
      .then((r) => {
        callback(r);
      });
  };
}

export default Api;
