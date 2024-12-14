import { Injectable } from '@nestjs/common';
import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import User from './user.model';
import * as usersMockData from './users.json';

@Injectable()
export class UserService {
  mysqlOptions: ConnectionOptions = {
    user: 'test',
    password: 'test',
  };
  connection: Connection;

  constructor() {
    this.connectDb();
  }

  async connectDb() {
    try {
      this.connection = await mysql.createConnection(this.mysqlOptions);
      await this.bootstrap();
    } catch (error) {
      console.log(error);
    }
  }

  async bootstrap() {
    await this.connection.query('CREATE DATABASE IF NOT EXISTS test;');
    await this.connection.query('USE test;');
    await this.connection.query(
      'CREATE TABLE IF NOT EXISTS users (id int(11) NOT NULL AUTO_INCREMENT, name VARCHAR(255), surname VARCHAR(255), email VARCHAR(255), password VARCHAR(255), phone VARCHAR(255), age INT(3), country VARCHAR(255), district VARCHAR(255), role VARCHAR(255), createdAt DATETIME, updatedAt DATETIME, PRIMARY KEY (id), UNIQUE (email));',
    );
    const [countResult] = await this.connection.query('SELECT COUNT(*) as count FROM users;');
    if (!countResult[0].count) {
      const mockRes = await this.multiSave(usersMockData['default']);
      if (mockRes.message === 'success') console.log('bootstrap successfully completed');
    }
  }

  async multiSave(users: Partial<User>[]): Promise<{ message: string }> {
    try {
      await this.connection.query(
        `INSERT INTO users (name, surname, email, password, phone, age, country, district, role, createdAt, updatedAt) VALUES ?`,
        [
          users.map((user) => [
            user.name,
            user.surname,
            user.email,
            bcrypt.hashSync(user.password, 10),
            user.phone,
            user.age,
            user.country,
            user.district,
            user.role,
            new Date(),
            new Date(),
          ]),
        ],
      );
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async getAll(query: { search: string; page: number; pageSize: number }): Promise<{ message: string; users?: User[] }> {
    try {
      if (!query.search) query.search = '%';
      const [result] = await this.connection.query(
        `SELECT * FROM users WHERE CONCAT(name, "\0", surname, "\0", email, "\0", phone, "\0", age, "\0", country, "\0", district, "\0", role, "\0", createdAt, "\0", updatedAt) LIKE '%${query.search}%' LIMIT ${query.pageSize} OFFSET ${(query.page - 1) * query.pageSize};`,
      );
      if ((result as User[]).length) {
        return { message: 'success', users: result as User[] };
      } else {
        return { message: 'not found any user' };
      }
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async count(search: string): Promise<{ message: string; count?: number }> {
    try {
      if (!search) search = '%';
      const [result] = await this.connection.query(
        `SELECT COUNT(*) as count FROM users WHERE CONCAT(name, "\0", surname, "\0", email, "\0", phone, "\0", age, "\0", country, "\0", district, "\0", role, "\0", createdAt, "\0", updatedAt) LIKE '%${search}%';`,
      );
      if (result) {
        return { message: 'success', count: result[0].count };
      } else {
        return { message: 'not found any user' };
      }
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async getById(id: string): Promise<{ message: string; user?: User }> {
    try {
      const [result] = await this.connection.query(`SELECT * FROM users WHERE id=${id};`);
      if (result[0]) {
        return { message: 'success', user: result[0] };
      } else {
        return { message: 'user not found' };
      }
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async save(user: Partial<User>): Promise<{ message: string }> {
    try {
      await this.connection.query(
        `INSERT INTO users (name, surname, email, password, phone, age, country, district, role, createdAt, updatedAt) VALUES (?)`,
        [
          [
            this.connection.escape(user.name),
            this.connection.escape(user.surname),
            user.email,
            bcrypt.hashSync(user.password, 10),
            user.phone,
            user.age,
            user.country,
            user.district,
            user.role,
            new Date(),
            new Date(),
          ],
        ],
      );
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }

  async update(user: Partial<User>): Promise<{ message: string }> {
    try {
      let updateText = '';
      Object.keys(user).forEach((key, index) => {
        if (key !== 'id' && key !== 'password') {
          updateText += ` ${key} = ${this.connection.escape(user[key])},`;
        }
      });
      await this.connection.query(`UPDATE users SET ${updateText} updatedAt=? WHERE id=?;`, [new Date(), user.id]);
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      return { message: 'error' };
    }
  }
}
