import { BGP } from "~/postgres/service";
import * as postgres from "@/services/postgres";

export async function retrieveBGPInfo(routerid: number): Promise<BGP[]> {
    const query = `
        SELECT * FROM bgp_configuration WHERE routerid = $1;
    `;

    return (await postgres.query<BGP>(query, [routerid]));
}

export async function createBGPConfiguration({
     configid,
     routerid,
     asnumber,
     bgprouterid,
     neighbour,
     network
}: BGP): Promise<void> {
    const query = `
        INSERT INTO bgp_configuration(configid, routerid, asnumber, bgprouterid, neighbour, network)
        VALUES (${configid ? configid : 'nextval(\'bgp_configuration_configid_seq\')'}, $1, $2, $3, $4, $5)
        ON CONFLICT ON CONSTRAINT bgp_configuration_pk
        DO 
            UPDATE
            SET
                configid = EXCLUDED.configid,
                routerid = EXCLUDED.routerid,
                asnumber = EXCLUDED.asnumber,
                bgprouterid = EXCLUDED.bgprouterid,
                neighbour = EXCLUDED.neighbour,
                network = EXCLUDED.network 
    `;

    await postgres.query(query, [routerid, asnumber, bgprouterid, neighbour, network]);
}

export async function deleteBGPConfiguration(configId: number): Promise<void> {
    const query = `
        DELETE FROM bgp_configuration WHERE configid = $1;
    `;

    await postgres.query(query, [configId]);
}