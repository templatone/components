export class Cookies {
  static get(name) {
    const cookieName = name + "=";
    const decodedCookie = window.decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return null;
  }
  static set(name, value, expiration) {
    const date = new Date();
    date.setTime(date.getTime() + expiration);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  static delete(name) {
    Cookies.set(name, "", -1);
  }
}
