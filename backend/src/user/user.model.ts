export default class User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  country: string;
  district: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(a: User) {
    this.id = a.id;
    this.name = a.name;
    this.surname = a.surname;
    this.email = a.email;
    this.password = a.password;
    this.phone = a.phone;
    this.age = a.age;
    this.country = a.country;
    this.district = a.district;
    this.role = a.role;
    this.createdAt = a.createdAt;
    this.updatedAt = a.updatedAt;
  }
}
