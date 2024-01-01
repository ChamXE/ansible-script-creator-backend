import {BGP, RawConnection, ParsedConnection, Destination, Source, CustomIntent} from "~/postgres/service";
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

export async function retrieveConnection(projectId: number): Promise<ParsedConnection> {
    const query = `
        SELECT
            r.routername AS source,
            s.switchname AS destination, rs.portname
        FROM router_switch rs
        INNER JOIN switch s
        ON rs.switchid = s.switchid AND s.controller IS NOT NULL
        INNER JOIN router r
        ON rs.routerid = r.routerid
        WHERE rs.projectid = $1
        UNION
        SELECT
            s1.switchname AS source,
            s2.switchname AS destination, ss.portname
        FROM switch_switch ss
        INNER JOIN switch s1
        ON s1.switchid = ss.switchid_src
        INNER JOIN switch s2
        ON s2.switchid = ss.switchid_dst
        WHERE ss.projectid = $1;
    `;

    return (await parseConnection(await postgres.query<RawConnection>(query, [projectId])));
}

async function parseConnection(connection: RawConnection[]): Promise<ParsedConnection> {
    const parsedConnection: ParsedConnection = {
        source: {},
        destination: {}
    };

    connection.forEach(({ source, destination, portname }) => {
        const dest: Destination = {};
        const src: Destination = {};
        src[source] = portname;
        dest[destination] = portname;
        if(!parsedConnection.source[source]) parsedConnection.source[source] = {};
        if(!parsedConnection.destination[destination]) parsedConnection.destination[destination] = {};
        Object.assign(parsedConnection.source[source], dest);
        Object.assign(parsedConnection.destination[destination], src);
    });

    return parsedConnection;
}

export async function retrieveSources(projectId: number): Promise<Source[]> {
    const query = `
        SELECT
            rs.routerid, r.routername,
            jsonb_agg(rs.configuration) as configuration
        FROM router_switch rs
        INNER JOIN switch s
        ON s.switchid = rs.switchid AND s.controller IS NULL
        INNER JOIN router r
        ON r.routerid = rs.routerid
        WHERE rs.projectid = $1
        GROUP BY rs.routerid, r.routername;
    `;

    return (await postgres.query<Source>(query, [projectId]));
}

export async function retrieveCustomIntent(projectId: number): Promise<CustomIntent[]> {
    const query = `
        SELECT * FROM custom_intent WHERE projectid = $1;
    `;

    return await postgres.query<CustomIntent>(query, [projectId]);
}

export async function upsertCustomIntent(intent: CustomIntent): Promise<void> {
    const { configid, routerid, projectid,
        source, sourcekey,
        destination, destkey,
        intermediate, protocol, ethertype
    } = intent;
    const query = `
        INSERT INTO custom_intent(configid, routerid, source, intermediate, destination, projectid, sourcekey, destkey, protocol, ethertype)
        VALUES(${configid ? configid : 'nextval(\'custom_intent_configid_seq\')'}, $1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT ON CONSTRAINT custom_intent_pk
        DO UPDATE
        SET
            configid = EXCLUDED.configid,
            routerid = EXCLUDED.routerid,
            source = EXCLUDED.source,
            intermediate = EXCLUDED.intermediate,
            destination = EXCLUDED.destination,
            projectid = EXCLUDED.projectid,
            sourcekey = EXCLUDED.sourcekey,
            destkey = EXCLUDED.destkey,
            protocol = EXCLUDED.protocol,
            ethertype = EXCLUDED.ethertype;
    `;

    await postgres.query(query, [routerid, source, intermediate, destination, projectid, sourcekey, destkey, protocol, ethertype]);
}

export async function deleteCustomIntent(configId: number): Promise<void> {
    const query = `
        DELETE FROM custom_intent WHERE configid = $1;
    `;

    await postgres.query(query, [configId]);
}