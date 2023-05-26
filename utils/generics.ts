export class Generics {
  static uuid(): string {
    const data = new Uint8Array(16);
    window.crypto.getRandomValues(data);

    // Set the version (4) and variant (2) bits
    data[6] = (data[6] & 0x0f) | 0x40;
    data[8] = (data[8] & 0x3f) | 0x80;

    const hex = Array.from(data)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    const sections = [
      hex.substr(0, 8),
      hex.substr(8, 4),
      hex.substr(12, 4),
      hex.substr(16, 4),
      hex.substr(20, 12),
    ];

    return sections.join('-');
  }
}
