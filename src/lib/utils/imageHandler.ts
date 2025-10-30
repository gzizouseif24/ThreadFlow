// Utility functions for handling local and remote images

/**
 * Convert a File object to base64 data URL
 */
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Fetch and cache a remote image as base64
 */
export async function cacheRemoteImage(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Failed to cache image:', error);
        // Return original URL if caching fails
        return url;
    }
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64Image(str: string): boolean {
    return str.startsWith('data:image/');
}

/**
 * Validate image file type
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return validTypes.includes(file.type);
}

/**
 * Compress image if it's too large (optional)
 */
export async function compressImage(base64: string, maxSizeKB: number = 500): Promise<string> {
    // If already small enough, return as is
    const sizeKB = (base64.length * 3) / 4 / 1024;
    if (sizeKB <= maxSizeKB) return base64;

    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            const ratio = Math.sqrt(maxSizeKB / sizeKB);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            } else {
                resolve(base64);
            }
        };
        img.src = base64;
    });
}
