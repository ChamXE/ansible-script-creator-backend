import * as postgres from '@/services/postgres';
import { Project } from '~/postgres/project';

export async function retrieveProjects(username: string): Promise<Project[]> {
    const query = `
        SELECT * FROM project WHERE username = $1;
    `;

    return (await postgres.query<Project>(query, [username]));
}