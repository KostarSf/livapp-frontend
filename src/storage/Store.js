export class Store {
  static Login = (email) => {
    console.log("Logined in as " + email);

    localStorage.setItem("email", email);
    if (email === "kostarsf@gmail.com") {
      localStorage.setItem("dev", true);
    }
  };

  static LogOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("dev");
  };

  static IsLogined = () => {
    return localStorage.getItem("email") !== null;
  };

  static IsDeveloper = () => {
    return localStorage.getItem("dev") !== null;
  };

  static GetEmail = () => {
    return localStorage.getItem("email");
  };

  static SetKey = (key) => {
    localStorage.setItem("key", key);
  };

  static GetKey = () => {
    return localStorage.getItem("key");
  };
}
