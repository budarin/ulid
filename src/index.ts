function uint8ArrayToHexString(byteArray: Uint8Array): string {
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i].toString(16);
        hexString += hex.length === 2 ? hex : '0' + hex;
    }
    return hexString;
}

function getRandomValues(buffer: Uint8Array): Uint8Array {
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
        return globalThis.crypto.getRandomValues(buffer);
    } else if (typeof require === 'function') {
        const crypto = require('crypto');
        const randomBytes = crypto.randomBytes(buffer.length);
        buffer.set(randomBytes);
        return buffer;
    } else {
        throw new Error('Secure random number generation is not supported in this environment.');
    }
}

export function ulid(now = Date.now()): string {
    const rnd = new Uint8Array(10);
    getRandomValues(rnd);

    const timeComponent = now.toString(16).padStart(12, '0');
    const randomComponent = uint8ArrayToHexString(rnd);

    return `${timeComponent.substring(0, 8)}-${timeComponent.substring(8)}-${randomComponent.substring(
        0,
        4,
    )}-${randomComponent.substring(4, 8)}-${randomComponent.substring(8)}`;
}
