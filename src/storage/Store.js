export class Store {
  static Login = (email) => {
    console.log("Logined in as " + email);

    sessionStorage.setItem("email", email);
    if (email === "kostarsf@gmail.com") {
      sessionStorage.setItem("dev", true);
    }
  };

  static LogOut = () => {
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("dev");
  };

  static IsLogined = () => {
    return sessionStorage.getItem("email") !== null;
  };

  static IsDeveloper = () => {
    return sessionStorage.getItem("dev") !== null;
  };

  static GetEmail = () => {
    return sessionStorage.getItem("email");
  };

  static SetKey = (key) => {
    sessionStorage.setItem("key", key);
  };

  static GetKey = () => {
    return sessionStorage.getItem("key");
  };
}
