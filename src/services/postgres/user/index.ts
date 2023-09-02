import * as postgres from '@/services/postgres';
import { Credentials, User } from '~/postgres/user';

export async function validateUser(credentials: Credentials): Promise<Token | null> {
    const query = `
        SELECT password FROM account WHERE username = $1;
    `;
    const result = (await postgres.query<{ password: string }>(query, [credentials.username])).pop();
    if (result && result.password === credentials.password) {
        return {
            "username": credentials.username,
            "token": "blablabla"
        }
    }

    return null;
}

export async function registerUser({ username, password, email }: User): Promise<void> {
    const query = `
        INSERT INTO account(username, password, email)
        VALUES($1, $2, $3);
    `;
    await postgres.query(query, [username, password, email]);
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    const query = `
        SELECT username FROM account WHERE username = $1;
    `;
    const result = (await postgres.query<{ username: string }>(query, [username])).pop();
    if (result) {
        return false;
    }
    return true;
}

export async function getUser(username: string): Promise<User | null> {
    const query = `
        SELECT username, email FROM account WHERE username = $1;
    `;

    return (await postgres.query<User>(query, [username])).pop() || null;
}

export async function getPassword(username: string): Promise<string | null> {
    const query = `
        SELECT password FROM account WHERE username = $1;
    `;

    const result = (await postgres.query<{ password: string }>(query, [username])).pop()
    return result?.password || null;
}

export async function changePassword(passwords: Credentials): Promise<void> {
    const query = `
        UPDATE account
        SET password = $2
        WHERE username = $1;
    `;
    await postgres.query(query, [passwords.username, passwords.newPassword]);
}