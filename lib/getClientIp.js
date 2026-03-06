export function getClientIp(req) {
    // Check headers in order of reliability
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return (
        req.headers.get('x-real-ip') ??
        req.headers.get('cf-connecting-ip') ??
        req.headers.get('x-client-ip') ??
        'unknown'
    );
}