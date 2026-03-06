export async function getGeoData(ip) {
    if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
        return { note: 'Localhost — no geo data available' };
    }

    // Using ip-api.com
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    const data = await res.json();

    if (data.status !== 'success') {
        return { error: 'Could not resolve geolocation' };
    }

    return data;
}