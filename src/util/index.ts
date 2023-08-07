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
