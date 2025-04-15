class User {
    constructor({
      id_usuario = 0,
      correo = '',
      rol = ''
    }) {
      this.userId = id_usuario;
      this.email = correo;
      this.rol = rol;

    }
    static fromJson(json) {
      return new User(json);
    }
  }
  