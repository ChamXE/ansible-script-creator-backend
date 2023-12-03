export function now(unit = 's'): number {
    let value = Date.now();
    switch (unit) {
        case 's':
            value /= 1000;
            break;
        case 'ms':
            break;
        case 'us':
            value *= 1000;
            break;
        case 'ns':
            value *= 1000_000;
            break;
        default:
            throw Error(`Unknown precision of type ${unit}`);
    }
    return Math.floor(value);
}

export function sleep(milliseconds = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function secondsToMinutes(seconds: number, int = true): number {
    const minutes = seconds / 60;
    return int ? Math.floor(minutes) : minutes;
}

export function random(min: number, max: number, fix = 0): number {
    return +(Math.random() * (max - min) + min).toFixed(fix);
}

export function splitBin(bin: string, bits = 8): string[] {
    const fill = '0';
    return [...Array(Math.ceil(bin.length / bits)).keys()].map((i) =>
        bin.slice(i * bits, (i + 1) * bits).padStart(bits, fill)
    );
}

export function Int8(value: number): number {
    return new Int8Array([value])[0];
}

export function Uint8(value: number): number {
    return new Uint8Array([value])[0];
}

export function Int16(value: number): number {
    return new Int16Array([value])[0];
}

export function Uint16(value: number): number {
    return new Uint16Array([value])[0];
}

export function Float32(value: number): number {
    return new Float32Array([value])[0];
}

export function Float32ToHex(f32: number): string {
    return `00${f32.toString(16)}`.slice(-2);
}

export function HexToBin(hex: string, pad = 32): string {
    return parseInt(hex, 16).toString(2).padStart(pad, '0');
}

export function Float32ToBin(f32: number): string {
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, f32);

    return HexToBin([...Array(4).keys()].reduce((s, i) => s + Float32ToHex(view.getUint8(i)), ''));
}

export const Subnet: { [mask: string]: number } = {
    '255.255.255.255': 32,
    '255.255.255.254': 31,
    '255.255.255.252': 30,
    '255.255.255.248': 29,
    '255.255.255.240': 28,
    '255.255.255.224': 27,
    '255.255.255.192': 26,
    '255.255.255.128': 25,
    '255.255.255.0': 24,
    '255.255.254.0': 23,
    '255.255.252.0': 22,
    '255.255.248.0': 21,
    '255.255.240.0': 20,
    '255.255.224.0': 19,
    '255.255.192.0': 18,
    '255.255.128.0': 17,
    '255.255.0.0': 16,
    '255.254.0.0': 15,
    '255.252.0.0': 14,
    '255.248.0.0': 13,
    '255.240.0.0': 12,
    '255.224.0.0': 11,
    '255.192.0.0': 10,
    '255.128.0.0': 9,
    '255.0.0.0': 8,
    '254.0.0.0': 7,
    '252.0.0.0': 6,
    '248.0.0.0': 5,
    '240.0.0.0': 4,
    '224.0.0.0': 3,
    '192.0.0.0': 2,
    '128.0.0.0': 1,
    '0.0.0.0': 0,
}