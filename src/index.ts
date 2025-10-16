function uint8ArrayToHexString(byteArray: Uint8Array): string {
    let hexString = '';
    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i]?.toString(16) ?? '00';
        hexString += hex.length === 2 ? hex : '0' + hex;
    }
    return hexString;
}

function getRandomValues(buffer: Uint8Array): Uint8Array {
    // Проверяем наличие Web Crypto API (браузер)
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
        return globalThis.crypto.getRandomValues(buffer);
    }

    // Проверяем наличие Node.js crypto модуля
    if (
        typeof globalThis !== 'undefined' &&
        (globalThis as any).process &&
        (globalThis as any).process.versions &&
        (globalThis as any).process.versions.node
    ) {
        try {
            // Динамический импорт для Node.js
            const crypto = eval('require')('crypto');
            const randomBytes = crypto.randomBytes(buffer.length);
            buffer.set(randomBytes);
            return buffer;
        } catch (e) {
            // Fallback если crypto недоступен
        }
    }

    throw new Error('Secure random number generation is not supported in this environment.');
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
