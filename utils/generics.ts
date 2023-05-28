export class Generics {
  static uuid(): string | undefined {
    try {
      const data = new Uint8Array(16);
      window.crypto.getRandomValues(data);

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
    } catch (error) {
      Debug.error({
        message: '🚨 Error generating uuid',
        source: 'utils/generics.ts',
        data: error,
        useOnProduction: true,
      });
    }
  }
  static valuesMatch<T>(a: T, b: T): boolean {
    if (!a || !b) {
      Debug.error({
        message: '🚨 Error comparing values',
        source: 'utils/generics.ts',
        data: { a, b },
      });
    }

    return JSON.stringify(a) === JSON.stringify(b);
  }
  static getObjectInfoSeparate(obj: object) {
    if (!obj) {
      Debug.error({
        message: '🚨 Error getting object info',
        source: 'utils/generics.ts',
        data: obj,
      });

      return;
    }

    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return { keys, values };
  }
  static dateSince(date: Date): string {
    if (!date) {
      Debug.error({
        message: '🚨 Error getting date',
        source: 'utils/generics.ts',
        data: date,
        useOnProduction: true,
      });

      throw createError({
        message: '🚨 Error getting date',
        statusCode: 500,
      });
    }

    const originalDate: Date = this.getObjectInfoSeparate(date)?.keys?.includes('seconds')
      ? // @ts-ignore
        new Date(date.seconds * 1000)
      : date;

    // Get the current date and time
    const currentDate: Date = new Date();

    // Calculate the difference in milliseconds between the current date and the input date
    const timeDiff: number = currentDate.getTime() - originalDate.getTime();

    // Convert the time difference from milliseconds to seconds
    const seconds: number = Math.floor(timeDiff / 1000);

    // Convert seconds to minutes
    const minutes: number = Math.floor(seconds / 60);

    // Convert minutes to hours
    const hours: number = Math.floor(minutes / 60);

    // Convert hours to days
    const days: number = Math.floor(hours / 24);

    // Convert days to weeks
    const weeks: number = Math.floor(days / 7);

    // Convert weeks to months (approximate)
    const months: number = Math.floor(weeks / 4.348);

    // Convert months to years
    const years: number = Math.floor(months / 12);

    // Create a string to represent the time since the input date
    let result: string = '';

    if (years > 0) {
      result += years === 1 ? '1 year' : `${years} years`;
    }

    if (months > 0) {
      if (result.length > 0) {
        result += ', ';
      }
      result += months === 1 ? '1 month' : `${months} months`;
    }

    if (weeks > 0) {
      if (result.length > 0) {
        result += ', ';
      }
      result += weeks === 1 ? '1 week' : `${weeks} weeks`;
    }

    if (days > 0) {
      if (result.length > 0) {
        result += ', ';
      }
      result += days === 1 ? '1 day' : `${days} days`;
    }

    if (hours > 0) {
      if (result.length > 0) {
        result += ', ';
      }
      result += hours === 1 ? '1 hour' : `${hours} hours`;
    }

    if (minutes > 0) {
      if (result.length > 0) {
        result += ', ';
      }
      result +=
        minutes === 1
          ? '1 minute'
          : `${(minutes % 60)?.toFixed(0) !== '0' ? `${(minutes % 60)?.toFixed(0)} minutes` : ''}`;
    }

    // Return the resulting string
    return result.length > 0 ? result + ' ago' : 'just now';
  }

  static allDataValid<T>(obj: T): boolean {
    if (!obj || typeof obj !== 'object') {
      Debug.error({
        message: '🚨 Error validating values',
        source: 'utils/generics.ts',
        data: obj,
      });

      return false;
    }

    Debug.log({
      message: '🚀 Validating values',
      source: 'utils/generics.ts',
      data: obj,
    });

    // check if all values are valid
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }

      const value = obj[key];

      if (Array.isArray(value) && value.length === 0) {
        console.log('array', value);

        return false;
      }

      if (typeof value === 'string' && !value.trim()) {
        console.log('string', value);

        return false;
      }

      if (typeof value === 'number' && value === 0) {
        return false;
      }

      if (typeof value === 'object' && Object.keys(value as object).length === 0) {
        return false;
      }

      if (typeof value === 'boolean' && !value) {
        return false;
      }
    }

    return true;
  }
}
