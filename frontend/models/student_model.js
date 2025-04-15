class Student {
    constructor({
      id_alumno = 0,
      id_usuario = 0,
      no_control = '',
      nombre = ''
    }) {
      this.studentId = id_alumno;
      this.userId = id_usuario;
      this.controlNumber = no_control.toString();
      this.name = nombre;
    }
    static fromJson(json) {
      return new Student(json);
    }
  }
  